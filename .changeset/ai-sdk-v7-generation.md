---
"@spiceai/spice-ai-provider": minor
---

Move to the AI SDK v7 generation: `@ai-sdk/provider` v4, `@ai-sdk/provider-utils` v5 and `@ai-sdk/openai-compatible` v3.

The provider now implements `ProviderV4` and returns `LanguageModelV4` / `EmbeddingModelV4`, so it requires `ai` v7 in the consuming application. `embeddingModel` is the `ProviderV4` name for the embedding factory; `textEmbeddingModel` remains available as an alias.

The package is now ESM-only, because the AI SDK packages it depends on no longer publish a CommonJS entry point.
