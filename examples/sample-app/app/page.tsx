"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

export const maxDuration = 30;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl py-24 px-8 mx-auto stretch">
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          <ReactMarkdown
            remarkPlugins={[remarkGFM, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            className="prose prose-sm prose-p:whitespace-normal prose-ol:whitespace-normal prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-h4:m-0 prose-headings:m-0 prose-p:m-0 prose-ol:m-0 text-wrap"
          >
            {m.content as string}
          </ReactMarkdown>
        </div>
      ))}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-4xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
