export type ButtonType = "success" | "primary" | "danger";

export class Button {
  letter: string;
  element: HTMLButtonElement;

  constructor(letter: string, type: ButtonType = "primary") {
    this.letter = letter;
    this.element = document.createElement("button");
    this.element.classList.value = `btn btn-${type} mx-1`;
    this.element.textContent = letter;
  }

  highLightError() {
    this.element.classList.add("btn-danger");

    setTimeout(() => {
      this.element.classList.remove("btn-danger");
    }, 500);
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
