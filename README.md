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

## Example

Navigate to [`examples/sample-app`](https://github.com/spiceai/spice-ai-provider/tree/trunk/examples/sample-app)

1. Install Spice runtime. [Learn more](https://docs.spiceai.org).

```shell
curl https://install.spiceai.org | /bin/bash
```

2. Copy `.env.example` → `.env`, and set your OpenAI API key and GitHub PAT for data connector

3. Start Spice runtime

```console
spice run
Checking for latest Spice runtime release...
Spice.ai runtime starting...
2024-09-10T14:17:37.598982Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-09-10T14:17:37.599070Z  INFO runtime::metrics_server: Spice Runtime Metrics listening on 127.0.0.1:9090
2024-09-10T14:17:37.599263Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:8090
2024-09-10T14:17:37.600010Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-09-10T14:17:38.175204Z  INFO runtime: Embedding [openai_embeddings] ready to embed
2024-09-10T14:17:38.175396Z  INFO runtime: Tool [document_similarity] ready to use
2024-09-10T14:17:38.175416Z  INFO runtime: Tool [table_schema] ready to use
2024-09-10T14:17:38.175421Z  INFO runtime: Tool [sql] ready to use
2024-09-10T14:17:38.175428Z  INFO runtime: Tool [list_datasets] ready to use
2024-09-10T14:17:38.179149Z  INFO runtime: Initialized results cache; max size: 128.00 MiB, item ttl: 1s
2024-09-10T14:17:38.179779Z  INFO runtime: Loading model [gpt-4o] from openai:gpt-4o...
2024-09-10T14:17:38.686558Z  INFO runtime: Model [gpt-4o] deployed, ready for inferencing
2024-09-10T14:17:39.174429Z  INFO runtime: Dataset vercel_ai_docs registered (github:github.com/vercel/ai/files/main), acceleration (arrow), results cache enabled.
2024-09-10T14:17:39.175632Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset vercel_ai_docs
2024-09-10T14:17:51.810106Z  INFO runtime::accelerated_table::refresh_task: Loaded 143 rows (2.29 MiB) for dataset vercel_ai_docs in 12s 634ms.
```

4. Start the web app

```shell
npm run dev
```

Navigate to http://localhost:3000, and now you can chat with Vercel AI SDK docs:

![CleanShot 2024-09-10 at 23 40 39@2x](https://github.com/user-attachments/assets/bbde759e-15c4-4667-b82c-1451c0b044a3)
