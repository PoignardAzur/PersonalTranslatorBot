import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const PREFIX = process.env.DISCORD_BOT_PREFIX;

const FILTER = new RegExp(`^${PREFIX}: (.*)`);

// ---

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot)
    return;

  if (!FILTER.test(message.cleanContent))
    return;

  let content = FILTER.exec(message.cleanContent)[1];

  message.reply(`Got message: ${content}`);
});

// ---

client.login(TOKEN);
