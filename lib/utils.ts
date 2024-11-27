import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

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
