"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { createSpice, createSpiceCloud } from "@spiceai/spice-ai-provider";

// connect to local spice runtime instance
const spice = createSpice();

// connect to spice instance in spice.ai cloud
// make sure to set SPICE_API_KEY environment variable
// const spice = createSpiceCloud();

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: spice.chat("openai-with-spice"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
