import { createOpenAI } from "@ai-sdk/openai";
import { StreamData, StreamingTextResponse, experimental_streamText } from "ai";
import type { RequestHandler } from "./$types";

import { env } from "$env/dynamic/private";

// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
// import { OPENAI_API_KEY } from "$env/static/private";

// Create an OpenAI Provider instance
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? "",
});

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const result = await experimental_streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
  });
  // optional: use stream data
  const data = new StreamData();

  data.append({ test: "value" });

  // Convert the response into a friendly text-stream
  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream, {}, data);
  // Respond with the stream
}) satisfies RequestHandler;
