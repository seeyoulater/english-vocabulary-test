const letterRegex = /^[a-zA-Z]$/;

type OnLetterCallback = (letter: string) => void;

export class KeyboardService {
  private onLetter: OnLetterCallback;
  private connected = false;

  constructor(onLetter: OnLetterCallback) {
    this.onLetter = onLetter;
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (!letterRegex.test(e.key) || e.shiftKey || e.ctrlKey) {
      return;
    }

    this.onLetter(e.key.toLocaleLowerCase());
  }

  connect() {
    if (this.connected) {
      return;
    }

    document.body.addEventListener('keydown', this.handleKeydown);
    this.connected = true
  }

  disconnect() {
    if (!this.connected) {
      return;
    }

    document.body.removeEventListener('keydown', this.handleKeydown);
    this.connected = false
  }
}
