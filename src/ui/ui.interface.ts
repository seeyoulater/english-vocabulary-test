import { TaskHandlerState } from "../domain/TaskHandler";

export type ButtonType = "success" | "primary" | "danger";
export interface UI {
  init: (onLetterClick: (letter: string) => boolean) => void;

  renderTask: (taskState: TaskHandlerState) => void;
  renderStatusbar: (question: number, total: number) => void;
  renderAnswer: (word: string, type: ButtonType) => void;
  showTaskScreen: () => void;
  showStatisticsScreen: (summary: string) => void;

  markLetter: (
    mark: "success" | "error",
    letter: string,
    index?: number,
  ) => void;
}
