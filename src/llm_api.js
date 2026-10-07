import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const SCW_SECRET_KEY = process.env.SCW_SECRET_KEY;

const client = new OpenAI({
  baseURL: "https://api.scaleway.ai/b5ee37aa-c587-4e37-94de-d650f645b8f8/v1",
  apiKey: SCW_SECRET_KEY,
});

async function translate_message(user_message) {
  const response = await client.chat.completions.create({
    model: "mistral-small-3.2-24b-instruct-2506",
    messages: [
      {
        role: "system",
        content: `You are a translator bot. You get up to a few messages of a conversation, and you have to translate the last message in the conversation literally from Japanese to French. Your answer will be posted directly in the conversation, so stick to direct translations if possible and avoid footnotes. Do note ambiguities if you can do so concisely and without breaking the flow.`
      },
      {
        role: "user",
        content: user_message,
      },
    ],
    max_tokens: 2048,
    temperature: 0.15,
    top_p: 1,
    presence_penalty: 0,
    response_format: { type: "text" },
    stream: false,
  });

  console.log(JSON.stringify(response));
  return response.choices[0].message.content;
}

export { translate_message };
