import { TaskHandlerState } from "../domain/TaskHandler";
import { ButtonType } from "./dom/Button";

export interface UI {
    init: (onLetterClick: (letter: string) => boolean) => void;
    renderTask: (taskState: TaskHandlerState) => void;
    showTaskScreen: () => void;
    showStatisticsScreen: (summary: string) => void;
    updateStatusBar: (question: number, total: number) => void;
    renderAnswer: (word: string, type: ButtonType) => void

    markLetter: (mark: 'success' | 'error', letter: string, index?: number) => void
}
