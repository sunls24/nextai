const openai = process.env.ALIST_OPENAI;
const token = process.env.ALIST_TOKEN;
const url = process.env.ALIST_URL;
const openaiUrl = url && `${url}/d${openai}`;

export async function updateOpenAIKeys(keys: string) {
  if (!token || !url) {
    throw new Error("not found ALIST_TOKEN or ALIST_URL");
  }
  const res = await fetch(`${url}/api/fs/put`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "File-Path": openai!,
      "Content-Type": "text/plain",
      "Content-Length": keys.length.toString(),
    },
    body: keys,
  });
  const response = await res.text();
  if (response.includes(":500") || !res.ok) {
    throw new Error(response);
  }
}

export async function getOpenAIKeys() {
  if (!openaiUrl) {
    throw new Error("not found openaiUrl");
  }
  const res = await fetch(openaiUrl, { cache: "no-cache" });
  const response = await res.text();
  if (!response) {
    throw new Error("OpenAI keys is empty");
  }
  if (!res.ok || response.includes(":500")) {
    throw new Error(response);
  }
  return response;
}
