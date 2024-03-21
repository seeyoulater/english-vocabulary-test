import { App } from "./app/App";
import { LocalStorageService } from "./service/StorageService";
import { DOM } from "./ui/dom/DOM";

const words = [
  "apple",
  "function",
  "timeout",
  "task",
  "application",
  "data",
  "tragedy",
  "sun",
  "symbol",
  "button",
  "software",
];

const ui = new DOM({
  container: "#app",
});

const storage = new LocalStorageService();

const app = new App(ui, storage, words);
