import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  loadApiKey,
  withoutTrailingSlash,
  type FetchFunction,
} from "@ai-sdk/provider-utils";
import type {
  EmbeddingModelV2,
  LanguageModelV2,
  ProviderV2,
} from "@ai-sdk/provider";

const SPICE_LOCAL_BASE_URL = "http://localhost:8090/v1";
const SPICE_CLOUD_BASE_URL = "https://data.spiceai.io/v1";

export interface SpiceProvider extends Omit<ProviderV2, "imageModel"> {
  (modelId: string): LanguageModelV2;

  languageModel(modelId: string): LanguageModelV2;

  chat(modelId: string): LanguageModelV2;

  completion(modelId: string): LanguageModelV2;

  textEmbeddingModel(modelId: string): EmbeddingModelV2<string>;
}

export interface SpiceProviderSettings {
  baseURL?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}

export function createSpice(
  options: SpiceProviderSettings = {},
): SpiceProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL ?? SPICE_LOCAL_BASE_URL) ??
    SPICE_LOCAL_BASE_URL;

  const isSpiceCloud = baseURL.includes(".spiceai.io");

  // The API key is required only for the Spice Cloud endpoint, and Spice expects
  // it in the `X-API-KEY` header rather than the OpenAI-style `Authorization:
  // Bearer` header — so it is supplied via `headers`, not the `apiKey` option.
  const headers: Record<string, string> = {
    ...(isSpiceCloud
      ? {
          "X-API-KEY": loadApiKey({
            apiKey: options.apiKey,
            environmentVariableName: "SPICE_API_KEY",
            description: "Spice AI",
          }),
        }
      : {}),
    ...options.headers,
  };

  const openaiCompatible = createOpenAICompatible({
    name: "spiceai",
    baseURL,
    headers,
    fetch: options.fetch,
  });

  const createChatModel = (modelId: string): LanguageModelV2 =>
    openaiCompatible.chatModel(modelId);

  function provider(modelId: string): LanguageModelV2 {
    if (new.target) {
      throw new Error(
        "The Spice model function cannot be called with the new keyword.",
      );
    }

    return createChatModel(modelId);
  }

  return Object.assign(provider, {
    languageModel: createChatModel,
    chat: createChatModel,
    completion: (modelId: string): LanguageModelV2 =>
      openaiCompatible.completionModel(modelId),
    textEmbeddingModel: (modelId: string): EmbeddingModelV2<string> =>
      openaiCompatible.textEmbeddingModel(modelId),
  }) as SpiceProvider;
}

export function createSpiceCloud(
  options: SpiceProviderSettings = {},
): SpiceProvider {
  return createSpice({
    baseURL: options.baseURL ?? SPICE_CLOUD_BASE_URL,
    ...options,
  });
}

export const spice = createSpice();
