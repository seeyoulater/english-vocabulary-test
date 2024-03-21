import { StorageService } from "./StorageService";

const storageKey = "session";

export class LocalStorageService implements StorageService {
  constructor() {
    this.checkValidity();
  }

  private async checkValidity() {
    try {
      JSON.parse(await this.getState());
    } catch {
      console.error("Invalid storage state, resetting to default...");
      this.clear();
    }
  }

  async setState(state: string) {
    localStorage.setItem(storageKey, state);
  }

  async getState() {
    return localStorage.getItem(storageKey);
  }

  async hasState() {
    return Boolean(this.getState());
  }

  async clear() {
    localStorage.removeItem(storageKey);
  }
}
