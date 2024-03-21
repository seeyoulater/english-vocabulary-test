export interface StorageService {
    setState: (state: string) => Promise<void>;
    getState: () => Promise<string>;
    hasState: () => Promise<boolean>;
    clear: () => Promise<void>;
}