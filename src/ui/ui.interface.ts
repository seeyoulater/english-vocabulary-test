import { TaskHandlerState } from "../domain/TaskHandler";

export type ButtonType = "success" | "primary" | "danger";

export type LetterClickHandler = (letter: string, index: number) => void;

export interface UI {
  onLetterClick: (handler: LetterClickHandler) => void;
  markLetter: (
    mark: "success" | "error",
    letter: string,
    index?: number,
  ) => void;

  renderTask: (taskState: TaskHandlerState) => void;
  renderStatusbar: (question: number, total: number) => void;
  renderAnswer: (word: string, type: ButtonType) => void;

  showTaskScreen: () => void;
  showStatisticsScreen: (summary: string) => void;
}
