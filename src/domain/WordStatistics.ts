import { ServiceWithCache } from "./ServiceWithCache";

type WordStatistics = {
  word: string;
  errors: number;
  success: boolean;
};

export type StatisticsState = {
  statistics: WordStatistics[];
  totalErrors: number;
  correctWords: number;
};

export class Statistics implements ServiceWithCache<StatisticsState> {
  private statistics: WordStatistics[] = [];
  private totalErrors: number = 0;
  private correctWords: number = 0;

  public reset() {
    this.statistics = [];
    this.totalErrors = 0;
    this.correctWords = 0;
  }

  public addWordStatistics(
    word: string,
    errors: number,
    success: boolean,
  ): void {
    if (!word) throw new Error("Word cannot be empty");

    this.statistics.push({ word, errors, success });
    this.totalErrors += errors;

    if (success) this.correctWords += 1;
  }

  public getSummary(): string {
    if (this.statistics.length === 0) return "No statistics available.";

    const wordWithMostErrors = this.statistics.reduce((prev, current) =>
      prev.errors > current.errors ? prev : current,
    );

    return `Correct words: ${this.correctWords}, Total errors: ${this.totalErrors}, Word with most errors: ${wordWithMostErrors.errors ? wordWithMostErrors.word : "-"}`;
  }

  public getWordStatistic(word: string) {
    return this.statistics.find((stat) => stat.word === word);
  }

  public getState(): StatisticsState {
    return {
      correctWords: this.correctWords,
      statistics: this.statistics,
      totalErrors: this.totalErrors,
    };
  }

  public setState(state: StatisticsState) {
    this.correctWords = state.correctWords;
    this.statistics = state.statistics;
    this.totalErrors = state.totalErrors;
  }
}
