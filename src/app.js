// Load up the discord.js library
const Discord = require("discord.js"),
  LRU = require("lru-cache"),
  Faucet = require("./faucet"),
  config = require("./config");

const client = new Discord.Client();
const faucet = new Faucet(config);
const cache = new LRU();

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Faucet Bot has started`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  //client.user.setActivity(`...`, { type: 'WATCHING' });
});

client.on("message", async (message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // prefix: !, / and >
  if (!/^(!|\/|>)/.test(message.content)) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  switch (command) {
    case config.command:
      let msg = `Sorry, please wait ${config.limit} hours between token requests from the same Discord account!`;
      if (!cache.has(message.author.id)) {
        const { ok, msg: resultMsg } = await faucet.send(args[0]);
        msg = resultMsg
        ok && cache.set(message.author.id, 1, 1000 * 60 * 60 * config.limit);
      }

      await message.reply(msg);
      break;

    default:
      await message.reply("Unknown command. Try `!energy <substrate-address>`");
      break;
  }
});

client.login(config.token);
