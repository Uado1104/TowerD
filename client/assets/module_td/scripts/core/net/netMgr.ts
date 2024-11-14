import { Command } from "./net";

interface GameplayStrategy {
    handleCommand<T, K>(command: Command<T, K>): Promise<K>;
}

class SinglePlayerStrategy implements GameplayStrategy {
    async handleCommand<T, K>(command: Command<T, K>) {
        return command.execute(); // Executes commands directly
    }
}

class MultiplayerStrategy implements GameplayStrategy {
    async handleCommand<T, K>(command: Command<T, K>) {
        return command.execute(); // Executes commands directly
    }
}

export class GameFacade {
    static readonly gameplaySingleStrategy = new SinglePlayerStrategy();

    static readonly gameplayMultiStrategy = new MultiplayerStrategy();
  
    static isSinglePlayer: boolean;

    static get strategy() {
        return this.isSinglePlayer ? this.gameplaySingleStrategy : this.gameplayMultiStrategy;
    }

    static performAction<T, K>(command: Command<T, K>) {
        return GameFacade.strategy.handleCommand(command);
    }
  }
  