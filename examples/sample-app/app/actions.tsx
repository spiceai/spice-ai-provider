"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { createSpice } from "@spiceai/spice-ai-provider";

const spice = createSpice();

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: spice.chat("gpt-4o"),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
