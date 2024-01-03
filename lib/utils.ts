import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

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

export async function fetchPost(
  url: string,
  data: Record<string, any>,
  headers?: Record<string, string>,
) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data),
  });
}

export function isString(str: any): str is string {
  return typeof str === "string";
}

export function isDall(model: string) {
  return model === "dall-e-3";
}
