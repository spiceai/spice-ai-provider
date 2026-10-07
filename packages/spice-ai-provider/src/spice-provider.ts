import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  loadApiKey,
  withoutTrailingSlash,
  type FetchFunction,
} from "@ai-sdk/provider-utils";
import type {
  EmbeddingModelV4,
  LanguageModelV4,
  ProviderV4,
} from "@ai-sdk/provider";

const SPICE_LOCAL_BASE_URL = "http://localhost:8090/v1";
const SPICE_CLOUD_BASE_URL = "https://data.spiceai.io/v1";

// Returns true only when the base URL's host is `spiceai.io` or a subdomain of
// it. Parsing the URL and matching on the hostname (rather than a substring
// `includes(".spiceai.io")`) prevents hosts like `evil.spiceai.io.attacker.com`
// or `attacker.com/?x=.spiceai.io` from being treated as Spice Cloud and being
// sent the API key.
function isSpiceCloudUrl(url: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return false;
  }
  return hostname === "spiceai.io" || hostname.endsWith(".spiceai.io");
}

export interface SpiceProvider extends Omit<ProviderV4, "imageModel"> {
  (modelId: string): LanguageModelV4;

  languageModel(modelId: string): LanguageModelV4;

  chat(modelId: string): LanguageModelV4;

  completion(modelId: string): LanguageModelV4;

  embeddingModel(modelId: string): EmbeddingModelV4;

  /** Alias for {@link SpiceProvider.embeddingModel}. */
  textEmbeddingModel(modelId: string): EmbeddingModelV4;
}

export interface SpiceProviderSettings {
  /** Runtime base URL. Defaults to `http://localhost:8090/v1`. */
  baseURL?: string;
  /**
   * API key, sent as the `X-API-KEY` header to the runtime at `baseURL`.
   * For Spice Cloud it defaults to the `SPICE_API_KEY` environment variable.
   */
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

  const isSpiceCloud = isSpiceCloudUrl(baseURL);

  // Spice expects the API key in the `X-API-KEY` header rather than the
  // OpenAI-style `Authorization: Bearer` header, so it is supplied via
  // `headers`, not the `apiKey` option of `createOpenAICompatible`.
  //
  // An explicit `apiKey` is sent to whatever runtime `baseURL` names: a
  // self-hosted runtime with API-key auth enabled rejects requests without it.
  // The `SPICE_API_KEY` environment variable is read only for Spice Cloud,
  // where a key is required, so an ambient key is never sent to another host.
  const apiKey =
    options.apiKey ??
    (isSpiceCloud
      ? loadApiKey({
          apiKey: undefined,
          environmentVariableName: "SPICE_API_KEY",
          description: "Spice AI",
        })
      : undefined);

  const headers: Record<string, string> = {
    ...(apiKey !== undefined ? { "X-API-KEY": apiKey } : {}),
    ...options.headers,
  };

  const openaiCompatible = createOpenAICompatible({
    name: "spiceai",
    baseURL,
    headers,
    fetch: options.fetch,
  });

  const createChatModel = (modelId: string): LanguageModelV4 =>
    openaiCompatible.chatModel(modelId);

  const createEmbeddingModel = (modelId: string): EmbeddingModelV4 =>
    openaiCompatible.textEmbeddingModel(modelId);

  function provider(modelId: string): LanguageModelV4 {
    if (new.target) {
      throw new Error(
        "The Spice model function cannot be called with the new keyword.",
      );
    }

    return createChatModel(modelId);
  }

  return Object.assign(provider, {
    specificationVersion: "v4",
    languageModel: createChatModel,
    chat: createChatModel,
    completion: (modelId: string): LanguageModelV4 =>
      openaiCompatible.completionModel(modelId),
    embeddingModel: createEmbeddingModel,
    textEmbeddingModel: createEmbeddingModel,
  }) as SpiceProvider;
}

export function createSpiceCloud(
  options: SpiceProviderSettings = {},
): SpiceProvider {
  // Spread first so an explicit `baseURL: undefined` still means Spice Cloud
  // rather than overriding the default and falling back to localhost.
  return createSpice({
    ...options,
    baseURL: options.baseURL ?? SPICE_CLOUD_BASE_URL,
  });
}

export const spice = createSpice();
