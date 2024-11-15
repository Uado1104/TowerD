export interface Command<T, K> {
    data: T;
    execute(): Promise<K>;
}

export class CommandBase<T, K> implements Command<T, K> {
    data: T;
    async execute(): Promise<K> {
        throw new Error('Method not implemented.');
    }
}