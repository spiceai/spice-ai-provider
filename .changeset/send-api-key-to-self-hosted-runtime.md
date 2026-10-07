---
"@spiceai/spice-ai-provider": patch
---

Send an explicit `apiKey` to the configured runtime, not only to Spice Cloud, so a self-hosted runtime with API key auth no longer rejects every request. `createSpiceCloud({ baseURL: undefined })` now targets Spice Cloud instead of falling back to localhost.
