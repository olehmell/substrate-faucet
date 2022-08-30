const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api"),
  { BN } = require("bn.js"),
  crypto = require("@polkadot/util-crypto");

const newBalance = (balance, padding) => new BN(balance * 100).mul(padding).divn(100);

module.exports = class Faucet {
  constructor(config) {
    this.config = config;
    this.api = null;
    this.init();
  }

  async init() {
    const ws = new WsProvider(this.config.ws);
    // this.api = await ApiPromise.create({ types: types, provider: ws });
    this.api = await ApiPromise.create({ provider: ws });
    // Retrieve the chain & node information information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version(),
    ]);
    // Log these stats
    console.log(
      `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    );
  }

  async send(address) {
    try {
      const addressType = this.api.registry.chainSS58;
      const check = crypto.isAddress(address);
  
      if (check) {
        const decimals = this.api.registry.chainDecimals[0];
        const symbol = this.api.registry.chainTokens[0];
        const padding = new BN(10).pow(new BN(decimals));
  
        const minAllowAmount = newBalance(this.config.minAllowAmount, padding)
  
        const currentBalance = await this.api.query.energy.energyBalance(address)

        if (currentBalance.gte(minAllowAmount)) {
          return {
            ok: false,
            msg: `You still have enough energy to use. You can use the faucet again once you have less than ${this.config.minAllowAmount} NRG.`,
          };
        }
  
        const keyring = new Keyring({ type: "sr25519" });
        const sender = keyring.addFromUri(this.config.mnemonic);
        // const sender = keyring.addFromUri('//Alice');
  
        const maxDripAmount = newBalance(this.config.amount, padding)
        const amount = maxDripAmount.sub(currentBalance)

        console.log(`Set ${this.config.amount} ${symbol} to ${address}`);
        const tx = await this.api.tx.energy
          .generateEnergy(address, amount)
          .signAndSend(sender);
        console.log("Drip sent with hash", tx.toHex());
        return {
          ok: true,
          msg: `Done! Your energy balance is ${
            this.config.amount
          } NRG. You can use it for social actions (create space/post/comment, upvote, follow etc.)`,
        };
      }
  
      return {
        ok: false,
        msg: `Invalid address! Please use the Subsocial network format with address type ${addressType}! >> <https://polkadot.js.org/apps/?rpc=${this.config.ws}#/accounts>`,
      };
    } catch (err) {
      console.error(err)
      return {
        ok: false,
        msg: `Unexpected error! ${err}`,
      };
    }
    
  }
};
