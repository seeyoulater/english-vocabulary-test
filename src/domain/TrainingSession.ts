import { shuffleArray } from "../utils";
import { ServiceWithCache } from "./ServiceWithCache";

export type TrainingSessionState = {
  currentWordIndex: number;
  tasks: string[];
};

export type Task = {
  word: string;
  currentIndex: number;
  total: number;
};

export class TrainingSession implements ServiceWithCache<TrainingSessionState> {
  private words: string[];
  private currentWordIndex: number;
  private maxTasks: number;
  private taskList: string[];

  constructor(words: string[], maxTasks: number = 6) {
    this.words = words;
    this.currentWordIndex = 0;
    this.maxTasks = maxTasks;
    this.taskList = [];
    this.generateTasks();
  }

  get total() {
    return this.taskList.length;
  }

  private generateTasks(): void {
    this.taskList = shuffleArray(this.words).slice(0, this.maxTasks);
  }

  // Returns the next task or null if there are no more tasks
  public getNextTask(): Task | null {
    if (this.currentWordIndex < this.taskList.length) {
      const task = {
        word: this.taskList[this.currentWordIndex],
        currentIndex: this.currentWordIndex + 1,
        total: this.taskList.length,
      };

      this.currentWordIndex += 1;

      return task;
    }

    return null;
  }

  // Returns the current task
  public getCurrentTask(): Task {
    return {
      word: this.taskList[this.currentWordIndex],
      currentIndex: this.currentWordIndex,
      total: this.total,
    };
  }

  public getState() {
    return {
      currentWordIndex: this.currentWordIndex,
      tasks: this.taskList,
    };
  }

  public setState(state: TrainingSessionState) {
    this.currentWordIndex = state.currentWordIndex;
    this.taskList = state.tasks;
  }

  public getTaskByIndex(index: number) {
    return this.taskList[index];
  }
}
