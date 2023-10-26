import { SEPARATOR } from "@/lib/constants";

export class ApiKeyPool {
  private keys: string[];
  private currentIndex: number;

  constructor(keys: string[]) {
    this.keys = keys;
    this.currentIndex = 0;
  }

  public getNext(custom?: string): string {
    if (custom) {
      return custom;
    }
    if (this.keys.length === 0) {
      return "";
    }
    const key = this.keys[this.currentIndex] ?? "";
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }

  private old = "";

  public update(keys: string): ApiKeyPool {
    if (keys === this.old) {
      return this;
    }
    this.old = keys;
    this.keys = keys.split(SEPARATOR);
    this.currentIndex = Math.min(this.currentIndex, keys.length - 1);
    return this;
  }
}

export const apiKeyPool = new ApiKeyPool([]);
