export interface IGameController {
  key: string;

  start(): void;

  pause(): void;

  resume(): void;

  end(): void;

  tick(dt: number): void;
}

export abstract class GameControllerBase implements IGameController {
  constructor(protected childControllers?: IGameController[]) {}

  abstract readonly key: string;

  private myIsPaused = false;

  private myIsStarted = false;

  start() {
    if (this.myIsStarted) {
      return;
    }
    this.onStart();
    this.myIsStarted = true;
  }

  resume() {
    if (!this.myIsStarted) {
      return;
    }
    this.onResume();
    this.myIsPaused = false;
  }

  pause() {
    if (!this.myIsStarted) {
      return;
    }
    this.myIsPaused = true;
    this.childControllers?.forEach((e) => e.pause());
    this.onPause();
  }

  end() {
    if (!this.myIsStarted) {
      return;
    }
    this.myIsStarted = false;
    this.childControllers?.forEach((e) => e.end());
    this.onEnd();
  }

  tick(dt: number) {
    if (this.myIsPaused || !this.myIsStarted) {
      return;
    }
    this.onTick(dt);
    this.childControllers?.forEach((e) => e.tick(dt));
  }

  protected abstract onStart(): void;

  protected abstract onPause(): void;

  protected abstract onResume(): void;

  protected abstract onEnd(): void;

  protected abstract onTick(dt: number): void;
}
