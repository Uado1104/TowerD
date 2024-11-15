interface GameController {
    init(): void;

    pause(): void;

    resume(): void;

    end(): void;

    tick(dt: number): void;
}

export class GameWaveController {
    
    start() {
        // Start the wave
    }

    pause() {
        // Pause the wave
    }

    resume() {
        // Resume the wave
    }

    end() {
        // End the wave
    }

    tick() {

    }
}

export class GameRoundController {

    private waveController = new GameWaveController();

    start() {
        // Start the round
    }

    pause() {
        // Pause the round
    }

    resume() {
        // Resume the round
    }

    end() {
        // End the round
    }

    tick() {

    }
}

export class GameSessionController implements GameController {

    private roundController = new GameRoundController();

    init() {
        // Start the game
    }

    pause() {
        // Pause the game
    }

    resume() {
        // Resume the game
    }

    end() {
        // End the game
    }

    tick() {

    }
}
