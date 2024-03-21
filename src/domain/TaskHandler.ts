import { shuffleString } from '../utils';
import { ServiceWithCache } from './ServiceWithCache';

export type TaskHandlerState = {
  originalWord: string;
  shuffledWord: string;
  userAttempt: string;
  errors: number;
};

const maxErrors = 3

export class TaskHandler implements ServiceWithCache <TaskHandlerState> {
  originalWord: string;
  shuffledWord: string;
  private userAttempt: string;
  private errors: number;

  constructor({ originalWord, shuffledWord, userAttempt = '', errors = 0 }: Partial<TaskHandlerState>) {
    this.originalWord = originalWord;
    this.shuffledWord = shuffledWord || shuffleString(originalWord);
    this.userAttempt = userAttempt;
    this.errors = errors;
  }

  get isFailed() {
    return this.errors >= maxErrors;
  }

  get isSuccessful() {
    return this.userAttempt === this.originalWord;
  }

  get isFininshed() {
    return this.isFailed || this.isSuccessful;
  }

  get isEmpty() {
    return !this.userAttempt.length
  }

  /**
   * Validate letter and add it to the final word in case of success
   */

  addUserInput(letter: string): boolean {
    if (this.isFailed) return false;

    if (
      this.originalWord.includes(letter) &&
      letter === this.originalWord[this.userAttempt.length]
    ) {
      this.userAttempt += letter;

      return true;
    } else {
      this.errors++;
    }

    return false;
  }

  getErrorsCount() {
    return this.errors;
  }

  getState(): TaskHandlerState {
    return {
      originalWord: this.originalWord,
      shuffledWord: this.shuffledWord,
      userAttempt: this.userAttempt,
      errors: this.errors,
    };
  }

  setState({
    errors,
    shuffledWord,
    userAttempt,
    originalWord,
  }: TaskHandlerState) {
    this.originalWord = originalWord;
    this.errors = errors;
    this.shuffledWord = shuffledWord;
    this.userAttempt = userAttempt;
  }
}
