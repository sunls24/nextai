import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { Config } from "@/lib/store/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(content: string) {
  navigator.clipboard
    .writeText(content)
    .then(() => toast.success("已拷贝至剪贴板"))
    .catch((e) => toast.error(`出错啦: ${e.message}`));
}

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？”“"、,.!?]*$/, "");
}

export function getLocaleTime(): string {
  return fmtLocaleTime(new Date());
}

export function fmtLocaleTime(time: Date): string {
  return time.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hourCycle: "h23",
  });
}

export async function fetchForm(url: string, data: Record<string, string>) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data),
  });
}

export async function tokenRegister({
  username,
  accessToken,
  updateCfg,
  sessionToken,
}: {
  username: string;
  accessToken: string;
  sessionToken?: string;
  updateCfg: (fn: (cfg: Config) => void) => void;
}) {
  const res = await fetchForm("/api/reverse/token/register", {
    unique_name: username,
    access_token: accessToken,
  });
  const body = await res.json();
  if (body.detail) {
    throw new Error(body.detail);
  }
  const shareToken = body.token_key;
  updateCfg((cfg) => {
    cfg.login = {
      enable: true,
      data: {
        email: username,
        expire: body.expire_at,
        shareToken: shareToken,
        accessToken: accessToken,
        sessionToken: sessionToken ?? cfg.login.data.sessionToken,
      },
    };
    cfg.apiConfig.apiKey = shareToken;
  });
}
