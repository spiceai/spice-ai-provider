import {
  EmbeddingModelV1,
  LanguageModelV1,
  ProviderV1,
} from "@ai-sdk/provider";
import {
  OpenAIChatLanguageModel,
  OpenAIChatSettings,
  OpenAICompletionLanguageModel,
  OpenAICompletionSettings,
  OpenAIEmbeddingModel,
  OpenAIEmbeddingSettings,
} from "@ai-sdk/openai/internal";
import {
  withoutTrailingSlash,
  loadApiKey,
  type FetchFunction,
} from "@ai-sdk/provider-utils";

const SPICE_LOCAL_BASE_URL = "http://localhost:8090/v1";
const SPICE_CLOUD_BASE_URL = "https://data.spiceai.io/v1";

export interface SpiceProvider extends ProviderV1 {
  languageModel(
    modelId: string,
    settings?: OpenAIChatSettings,
  ): LanguageModelV1;

  chat(modelId: string, settings?: OpenAIChatSettings): LanguageModelV1;

  completion(
    modelId: string,
    settings?: OpenAICompletionSettings,
  ): LanguageModelV1;

  textEmbeddingModel(
    modelId: string,
    settings?: OpenAIEmbeddingSettings,
  ): EmbeddingModelV1<string>;
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
  const baseURL = withoutTrailingSlash(options.baseURL ?? SPICE_LOCAL_BASE_URL);

  const isCloud = baseURL?.startsWith(SPICE_CLOUD_BASE_URL);

  // api_key required only for spice cloud provider
  const getHeaders = isCloud
    ? () => ({
        "X-API-KEY": loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: "SPICE_API_KEY",
          description: "Spice AI",
        }),
        ...options.headers,
      })
    : () => ({ ...options.headers });

  const url = ({ path }: { path: string }) => `${baseURL}${path}`;

  const createChatModel = (
    modelId: string,
    settings: OpenAIChatSettings = {},
  ) =>
    new OpenAIChatLanguageModel(modelId, settings, {
      provider: "spiceai.chat",
      url,
      headers: getHeaders,
      compatibility: "compatible",
      fetch: options.fetch,
    });

  const createCompletionModel = (
    modelId: string,
    settings: OpenAICompletionSettings = {},
  ) =>
    new OpenAICompletionLanguageModel(modelId, settings, {
      provider: "spiceai.completion",
      url,
      compatibility: "compatible",
      headers: getHeaders,
      fetch: options.fetch,
    });

  const createEmbeddingModel = (
    modelId: string,
    settings: OpenAIEmbeddingSettings = {},
  ) =>
    new OpenAIEmbeddingModel(modelId, settings, {
      provider: "spiceai.embeddings",
      headers: getHeaders,
      url,
      fetch: options.fetch,
    });

  const provider = function (
    modelId: string,
    settings?: OpenAIChatSettings | OpenAICompletionSettings,
  ) {
    if (new.target) {
      throw new Error(
        "The Spice model function cannot be called with the new keyword.",
      );
    }

    return createChatModel(modelId, settings as OpenAIChatSettings);
  };

  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;

  return provider as SpiceProvider;
}

export function createSpiceCloud(options: SpiceProviderSettings = {}) {
  return createSpice({
    baseURL: options.baseURL ?? SPICE_CLOUD_BASE_URL,
    ...options,
  });
}

export const spice = createSpice();
