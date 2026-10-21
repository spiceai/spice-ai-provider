---
"@spiceai/spice-ai-provider": patch
---

`completion()` now returns the chat model. The Spice runtime serves no `/v1/completions` route, so every call through the previous completion model failed with `404 Not Found`. `completion()` is deprecated; use `chat()` or `languageModel()`.
