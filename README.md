# Soonsocial Faucet for Discord

## Using:

1. Join to [Subsocial Devs chat](https://discord.gg/yHRFdyMCmA)

2. Write message:
```
!drip <your-address>
```
3. Open [Subsocial Docs](https://docs.subsocial.network/docs/sdk/quick-start/intro) and develop your awesome daps!

## Development

Clone repo:
```
git clone 
```

Install dependencies:
```
yarn
```

Set ENV:
```
cp example.env .env
```

Edit `.env` file:
```
NODE_ENV=production

BOT_TOKEN=<set Discord bot token>
MNEMONIC=<set your mnemonic>
WS=<set your node url aka ws://localhost:9944>
```

Run dev server
```
yarn dev
```

Start bot in another terminal:
```
yarn start
```

## Deploy
Compile project:
```
yarn prod
```

Deploy as Node.js server