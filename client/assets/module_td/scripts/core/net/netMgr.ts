import { Command } from "./net";

interface GameplayNetController {
    handleCommand<T, K>(command: Command<T, K>): Promise<K>;
}

class SinglePlayerNetController implements GameplayNetController {
    async handleCommand<T, K>(command: Command<T, K>) {
        return command.execute(); // Executes commands directly
    }
}

class MultiplayerNetController implements GameplayNetController {
    async handleCommand<T, K>(command: Command<T, K>) {
        return command.execute(); // Executes commands directly
    }
}

export class NetController {
    static readonly singleController = new SinglePlayerNetController();

    static readonly multiplayerController = new MultiplayerNetController();
  
    static isOffline: boolean = true;

    static get controller() {
        return this.isOffline ? this.singleController : this.multiplayerController;
    }

    static performAction<T, K>(command: Command<T, K>) {
        return NetController.controller.handleCommand(command);
    }
  }
  