export interface IGameController {
  start(): void;

  pause(): void;

  resume(): void;

  end(): void;

  tick(dt: number): void;
}

export abstract class GameControllerBase {
  constructor(protected childController?: IGameController) {}

  private myIsPaused = false;

  private myIsStarted = false;

  start() {
    if (this.myIsStarted) {
      return;
    }
    this.onStart();
    this.myIsStarted = true;
  }

  pause() {
    if (!this.myIsStarted) {
      return;
    }
    this.myIsPaused = true;
    this.childController?.pause();
    this.onPause();
  }

  resume() {
    if (!this.myIsStarted) {
      return;
    }
    this.onResume();
    this.childController?.resume();
    this.myIsPaused = false;
  }

  end() {
    if (!this.myIsStarted) {
      return;
    }
    this.myIsStarted = false;
    this.childController?.end();
    this.onEnd();
  }

  tick(dt: number) {
    if (this.myIsPaused || !this.myIsStarted) {
      return;
    }
    this.onTick(dt);
    this.childController?.tick(dt);
  }

  protected abstract onStart(): void;

  protected abstract onPause(): void;

  protected abstract onResume(): void;

  protected abstract onEnd(): void;

  protected abstract onTick(dt: number): void;
}
