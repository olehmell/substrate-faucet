const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api"),
  { BN } = require("bn.js"),
  crypto = require("@polkadot/util-crypto");

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
    const addressType = this.api.registry.chainSS58;
    const check = crypto.isAddress(address);

    if (check) {
      const keyring = new Keyring({ type: "sr25519" });
      const sender = keyring.addFromUri(this.config.mnemonic);
      // const sender = keyring.addFromUri('//Alice');
      const decimals = this.api.registry.chainDecimals[0];
      const symbol = this.api.registry.chainTokens[0];
      const padding = new BN(10).pow(new BN(decimals));
      const amount = new BN(this.config.amount).mul(padding);
      console.log(`Sending ${this.config.amount} ${symbol} to ${address}`);
      const tx = await this.api.tx.balances
        .transferKeepAlive(address, amount)
        .signAndSend(sender);
      console.log("Transfer sent with hash", tx.toHex());
      return {
        ok: true,
        msg: `Done! Transfer ${
          this.config.amount
        } ${symbol} to ${address} with hash ${tx.toHex()}`,
      };
    }

    return {
      ok: false,
      msg: `Invalid address! Plese use the Subsocial network format with address type ${addressType}! >> <https://polkadot.js.org/apps/?rpc=${this.config.ws}#/accounts>`,
    };
  }
};
