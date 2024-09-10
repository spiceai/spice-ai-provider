<img src="https://www.spiceai.org/spice-logotype.png" alt="spice ai" width="64" />

# Spice AI Provider

Vercel AI Provider for [Spice runtime](https://www.spiceai.org/)

## Installation

```shell
npm install @spiceai/spice-ai-provider
```

## Usage

Check Spice.ai to learn how to install and get started with local runtime:
- [Install and start spice runtime](https://docs.spiceai.org/getting-started)
- [Configure OpenAI or compatible LLM models](https://docs.spiceai.org/components/models/openai)

## Connect to local spice runtime

You can import default spice provider instance `spice` from `@spiceai/spice-ai-provider`

```ts
import { spice } from "@spiceai/spice-ai-provider";
```

If you need a cusom setup, use `createSpice` and create provider with your settings:

```ts
import { createSpice } from "@spiceai/spice-ai-provider";

const spice = createSpice({
  // ...
});
```

Provider settings:

- **baseURL** - optional, defaults to `http://localhost:8090/v1`
