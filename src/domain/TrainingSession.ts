import { ServiceWithCache } from './ServiceWithCache';

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
  private tasks: string[];

  constructor(words: string[], maxTasks: number = 6) {
    this.words = words;
    this.currentWordIndex = 0;
    this.maxTasks = maxTasks;
    this.tasks = [];
    this.generateTasks();
  }

  get total() {
    return this.tasks.length
  }

  private generateTasks(): void {
    const shuffledIndices = Array.from(Array(this.words.length).keys())
      .sort(() => Math.random() - 0.5)
      .slice(0, this.maxTasks);

    this.tasks = shuffledIndices.map((index) => this.words[index]);
  }

  public getNextTask(): Task {
    if (this.currentWordIndex < this.tasks.length) {
      const nextIndex = this.currentWordIndex++

      return {
        word: this.tasks[nextIndex],
        currentIndex: nextIndex + 1,
        total: this.tasks.length,
      };
    }

    return null;
  }

  public getCurrentTask(): Task {
    return {
      word: this.tasks[this.currentWordIndex],
      currentIndex: this.currentWordIndex,
      total: this.total,
    };
  }

  public getState () {
    return {
      currentWordIndex: this.currentWordIndex,
      tasks: this.tasks,
    }
  };

  public setState(state: TrainingSessionState) {
    this.currentWordIndex = state.currentWordIndex;
    this.tasks = state.tasks;
  };

  public getTaskByIndex(index: number) {
    return this.tasks[index]
  }
}
