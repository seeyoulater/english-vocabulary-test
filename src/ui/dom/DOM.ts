import { TaskHandlerState } from "../../domain/TaskHandler";
import { isButtonTarget, sanitize } from "../../utils";
import { ButtonType, LetterClickHandler, UI } from "../ui.interface";
import { Button } from "./Button";

const enum Screen {
  Task = "Task",
  Results = "Results",
}

type DOMProps = {
  container: string;
};

export class DOM implements UI {
  private $root: HTMLElement | null = null;
  private currentButtons: Button[] = [];
  private screen: Screen | null = null;
  private _letterClickHandler: LetterClickHandler | null = null;

  constructor({ container }: DOMProps) {
    this.$root = document.querySelector(container);
  }

  /**
   * DOM Access
   */
  get $letters() {
    return this.$root?.querySelector("#letters");
  }

  get $answer() {
    return this.$root?.querySelector("#answer");
  }

  get $currentQuestion() {
    return this.$root?.querySelector("#current_question");
  }

  get $total() {
    return this.$root?.querySelector("#total_questions");
  }

  private attachListeners() {
    this.$letters?.addEventListener("click", this.handleLetterClick.bind(this));
  }

  private detachListeners() {
    this.$letters?.removeEventListener(
      "click",
      this.handleLetterClick.bind(this),
    );
  }

  private handleLetterClick(e: Event) {
    if (!(e instanceof MouseEvent)) return;
    if (!isButtonTarget(e.target)) return;

    const index = Array.from(this.$letters?.childNodes ?? []).indexOf(e.target);
    const letter = this.currentButtons[index];

    if (!letter) {
      return;
    }

    this._letterClickHandler?.(letter.letter, index);
  }

  private addAnswerLetter(letters: string, buttonType?: ButtonType) {
    this.$answer?.append(
      ...letters
        .split("")
        .map((letter) => new Button(letter, buttonType).element),
    );
  }

  public onLetterClick(handler: LetterClickHandler) {
    if (this._letterClickHandler) {
      throw Error("Click handler already attached");
    }

    this._letterClickHandler = handler;
  }

  public markLetter(mark: "success" | "error", letter: string, index?: number) {
    const _index =
      index ||
      this.currentButtons.findIndex((button) => button.letter === letter);

    if (_index === -1) {
      return;
    }

    const button = this.currentButtons[_index];

    if (mark === "success") {
      button.destroy();
      this.currentButtons.splice(_index, 1);
      this.addAnswerLetter(button.letter, "success");
    } else {
      button.highLightError();
    }
  }

  public renderTask(task: TaskHandlerState) {
    if (!this.$answer || !this.$letters) return;

    this.$answer.innerHTML = "";
    this.$letters.innerHTML = "";

    if (task.userAttempt) {
      this.addAnswerLetter(task.userAttempt, "success");
    }

    const shuffledWord = Array.from(task.userAttempt).reduce(
      (result, letterToRemove) => {
        const letters = [...result];
        const index = letters.indexOf(letterToRemove);

        if (~index) {
          letters.splice(index, 1);
        }

        return letters;
      },
      Array.from(task.shuffledWord),
    );

    this.currentButtons = Array.from(
      shuffledWord,
      (letter) => new Button(letter),
    );

    this.$letters.append(
      ...this.currentButtons.map((button) => button.element),
    );
  }

  public renderStatusbar(question: number, total: number) {
    if (!this.$currentQuestion || !this.$total) return;

    this.$currentQuestion.innerHTML = sanitize(question.toString());
    this.$total.innerHTML = sanitize(total.toString());
  }

  public renderAnswer(word: string, type: ButtonType = "danger") {
    if (!this.$answer || !this.$letters) return;

    this.$answer.innerHTML = "";
    this.$letters.innerHTML = "";
    this.addAnswerLetter(word, type);
  }

  public showTaskScreen() {
    if (this.screen === Screen.Task || !this.$root) {
      return;
    }

    this.$root.innerHTML = `
        <p class="lead mb-1">Form a valid English word using the given letters</p>
        <p class="mb-5">Question <span id="current_question">1</span> of <span id="total_questions">10</span></p>
        <div>
            <div id="answer" class="bg-light mx-1 d-flex align-items-center justify-content-center" style="height: 46px; border-radius: 6px"></div>
            <div id="letters" class="mt-3"></div>
        </div>
    `;

    this.attachListeners();

    this.screen = Screen.Task;
  }

  public showStatisticsScreen(summary: string) {
    if (this.screen === Screen.Results || !this.$root) {
      return;
    }

    this.detachListeners();

    this.$root.innerHTML = `<div class="alert alert-info" role="alert">${sanitize(summary)}</div>`;
    this.screen = Screen.Results;
  }
}
