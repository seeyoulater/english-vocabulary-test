export interface StorageService {
  setState: (state: string) => Promise<void>;
  getState: () => Promise<string | null>;
  hasState: () => Promise<boolean>;
  clear: () => Promise<void>;
}
