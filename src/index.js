import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { translate_message } from "./llm_api.js";

dotenv.config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const TEST_PREFIX = process.env.DISCORD_TEST_PREFIX;
const BOT_PREFIX = process.env.DISCORD_BOT_PREFIX;

const HAS_JAPANESE = /\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u;

function stripPrefix(str, prefix) {
  if (!str.startsWith(prefix))
    return null;
  return str.slice(prefix.length).trim();
}

if (process.env.TEST_SOME_STUFF) {
  const hasJapanese = (str) => {
    let result = HAS_JAPANESE.test(str);
    console.log(str, "->", result);
  };

  hasJapanese("こんにちは"); // true
  hasJapanese("カタカナ");   // true
  hasJapanese("漢字");      // true
  hasJapanese("hello");     // false
}

// ---

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot)
    return;
  if (!HAS_JAPANESE.test(message.cleanContent))
    return;

  let test_mode = message.cleanContent.startsWith(TEST_PREFIX);
  let content =
    stripPrefix(message.cleanContent, TEST_PREFIX)
    || stripPrefix(message.cleanContent, BOT_PREFIX);

  if (!message)
    return;

  if (test_mode) {
    message.reply(`Got message: ${content}`);
  }
  message.reply(await translate_message(content));
});

// ---

client.login(TOKEN);
