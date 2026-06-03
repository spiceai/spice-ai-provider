"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { type ModelMessage, streamText } from "ai";
import { createSpice } from "@spiceai/spice-ai-provider";

const spice = createSpice();

export async function continueConversation(messages: ModelMessage[]) {
  const result = await streamText({
    model: spice.chat("o3-mini"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
