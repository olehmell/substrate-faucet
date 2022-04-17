require('dotenv').config()

const envs = {
  token: process.env.BOT_TOKEN,
  ws: process.env.WS,
  mnemonic: process.env.MNEMONIC,
}

module.exports = {
  ...envs,
  prefix: "!", // prefix for run command
  command: 'drip', // commande for run faucet action
  amount: 10,
  limit: 24, // The time limit for sending requests is in hours.
};
