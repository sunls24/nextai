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

  public update(keys: string): ApiKeyPool {
    if (keys === this.keys) {
      return this;
    }
    this.keys = keys;
    this.keyList = keys.split(SEPARATOR);
    this.currentIndex = 0;
    return this;
  }
}
