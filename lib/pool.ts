import { get } from "@vercel/edge-config";
import { OPENAI_API_KEY } from "@/lib/constants";

export const SEPARATOR = ",";

export class ApiKeyPool {
  private keys = "";
  private keyList: string[] = [];
  private currentIndex: number = 0;

  public getNext(): string {
    if (this.keyList.length === 0) {
      return this.keys;
    }
    const key = this.keyList[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keyList.length;
    return key;
  }

  public update(keys: string, onUpdate?: () => void): ApiKeyPool {
    if (keys === this.keys) {
      return this;
    }
    this.keys = keys;
    this.keyList = keys.split(SEPARATOR);
    this.currentIndex = 0;
    onUpdate?.();
    return this;
  }

  public async getNextEdge(onUpdate?: () => void): Promise<string> {
    await this.updateEdge(onUpdate);
    return this.getNext();
  }

  private async updateEdge(onUpdate?: () => void) {
    if (!process.env.EDGE_CONFIG) {
      return;
    }
    const keys = await get(OPENAI_API_KEY);
    if (keys) {
      this.update(keys as string, onUpdate);
    }
  }
}
