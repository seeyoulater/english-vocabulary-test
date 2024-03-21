import { KeyboardService } from "../service/KeyboardService";
import { RouterPage, RouterService } from "../service/RouterService";
import { StorageService } from "../service/StorageService";
import { TaskHandler, TaskHandlerState } from "../domain/TaskHandler";
import {
  Task,
  TrainingSession,
  TrainingSessionState,
} from "../domain/TrainingSession";
import { Statistics, StatisticsState } from "../domain/WordStatistics";
import { UI } from "../ui/ui.interface";

export class App {
  private trainingSession: TrainingSession;
  private taskHandler?: TaskHandler;
  private statistics: Statistics;
  private ui: UI;
  private storage: StorageService;
  private keyboard: KeyboardService;
  private router: RouterService;

  private isBusy = false;

  constructor(ui: UI, storage: StorageService, words: string[]) {
    this.trainingSession = new TrainingSession(words);
    this.statistics = new Statistics();
    this.keyboard = new KeyboardService(this.validateLetter.bind(this));
    this.router = new RouterService(this.onRouteChange.bind(this));

    // DI for inversion of control
    this.storage = storage;
    this.ui = ui;

    this.restore();
  }

  private onRouteChange(e: PopStateEvent) {
    const route = this.router.getCurrentRouteName();

    switch (route) {
      case RouterPage.Results:
        this.finishSession();
        break;
      case RouterPage.Task:
        this.ui.showTaskScreen();
        const { taskId } = e.state ?? {};

        if (taskId) {
          const word = this.trainingSession.getTaskByIndex(taskId - 1);
          const wordStats = this.statistics.getWordStatistic(word);

          /**
           * No stats means that word isn't finished yet
           */
          if (!wordStats) {
            this.restore(true);
            this.keyboard.connect();
            return;
          }

          this.keyboard.disconnect();
          this.ui.renderAnswer(word, wordStats.success ? "success" : "danger");
          this.ui.renderStatusbar(taskId, this.trainingSession.total);
        }
        break;
    }
  }

  /**
   * Restore last session or start exercise
   */
  private async restore(restoreWithoutAsking?: boolean) {
    const cache = await this.storage.getState();

    this.ui.showTaskScreen();
    this.ui.init(this.validateLetter.bind(this));

    const aborted =
      !restoreWithoutAsking &&
      !confirm("You have unfinished excercise, restore?");

    if (!cache || aborted) {
      this.storage.clear();
      this.runTask(this.trainingSession.getNextTask());
      return;
    }

    try {
      const {
        trainingSession,
        taskHandler,
        statistics,
      }: {
        trainingSession: TrainingSessionState;
        taskHandler: TaskHandlerState;
        statistics: StatisticsState;
      } = JSON.parse(cache);

      this.trainingSession.setState(trainingSession);
      this.statistics.setState(statistics);
      this.runTask(this.trainingSession.getCurrentTask(), taskHandler);
    } catch (e) {
      console.error("Unable to parse storage");
      this.storage.clear();
      this.runTask(this.trainingSession.getNextTask());
    }
  }

  private saveCache() {
    this.storage.setState(
      JSON.stringify({
        trainingSession: this.trainingSession.getState(),
        taskHandler: this.taskHandler.getState(),
        statistics: this.statistics.getState(),
      }),
    );
  }

  /**
   * Validates letter from button / keyboard
   */
  private validateLetter(letter: string, index: number) {
    if (!this.taskHandler) {
      throw Error("No running tasks");
    }

    if (this.isBusy) {
      return;
    }

    this.ui.markLetter(
      this.taskHandler.addUserInput(letter) ? "success" : "error",
      letter,
      index,
    );

    if (this.taskHandler.isFininshed) {
      this.statistics.addWordStatistics(
        this.taskHandler.originalWord,
        this.taskHandler.getErrorsCount(),
        this.taskHandler.isSuccessful,
      );
    }

    if (this.taskHandler.isSuccessful) {
      this.finishTask();
    }

    if (this.taskHandler.isFailed) {
      this.ui.renderAnswer(this.taskHandler.originalWord, "danger");
      this.finishTask();
    }

    this.saveCache();
  }

  private finishSession() {
    this.storage.clear();
    this.keyboard.disconnect();
    this.ui.showStatisticsScreen(this.statistics.getSummary());
  }

  private finishTask() {
    this.isBusy = true;

    setTimeout(() => {
      this.isBusy = false;
      this.runTask(this.trainingSession.getNextTask());
    }, 1400);
  }

  private runTask(task: Task, state?: TaskHandlerState): void {
    if (task) {
      this.keyboard.connect();
      this.taskHandler = new TaskHandler(state || { originalWord: task.word });
      this.ui.renderTask(this.taskHandler.getState());
      this.ui.renderStatusbar(task.currentIndex, task.total);
      this.router.goTo(RouterPage.Task, { taskId: task.currentIndex });

      /**
       * Do not save the first task if there's no attempts
       */
      if (!(task.currentIndex === 1 && this.taskHandler.isEmpty)) {
        this.saveCache();
      }
    } else {
      this.finishSession();
      this.router.goTo(RouterPage.Results);
    }
  }
}
