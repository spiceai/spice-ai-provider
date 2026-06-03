---
"@spiceai/spice-ai-provider": minor
---

Upgrade to Vercel AI SDK v5.

The provider now implements the AI SDK v5 provider interface (`LanguageModelV2` / `ProviderV2`) so it works with `ai@^5`. It is rebuilt on top of `@ai-sdk/openai-compatible` instead of reaching into `@ai-sdk/openai/internal`, which is more stable across AI SDK releases.

- Dependencies: `@ai-sdk/provider` `^1` → `^2`, `@ai-sdk/provider-utils` `^2` → `^3`; replace `@ai-sdk/openai` with `@ai-sdk/openai-compatible@^1`.
- `peerDependencies.zod` widened to `^3.25.76 || ^4.1.8` to match the v5 SDK.
- Public API (`createSpice`, `createSpiceCloud`, `spice`, `SpiceProvider`, `SpiceProviderSettings`) and the `chat` / `completion` / `languageModel` / `textEmbeddingModel` methods are unchanged. Spice Cloud authentication continues to use the `X-API-KEY` header.

This is a breaking change for consumers: the provider now requires AI SDK v5 (`ai@^5`) and is no longer compatible with `ai@^4`.
