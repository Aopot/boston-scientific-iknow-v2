export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getEndpoint() {
  const base = process.env.DASHSCOPE_BASE_URL?.trim() || "https://dashscope.aliyuncs.com/compatible-mode/v1";
  if (base.includes("/chat/completions")) return base;
  return `${base.replace(/\/+$/, "")}/chat/completions`;
}

export async function POST(req: Request) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing DASHSCOPE_API_KEY" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = (body ?? {}) as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Missing messages" }, { status: 400 });
  }

  const model = process.env.DASHSCOPE_MODEL?.trim() || "qwen3-plus";
  const endpoint = getEndpoint();

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: "DashScope request failed", status: upstream.status, details: text },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
