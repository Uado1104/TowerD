
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TEventHandle = (...args: any[]) => void;

export type TEventHandleParams<T> = T extends (...args: infer U) => void ? U : never;

export class EventDispatcher<
    TEventDefine extends Record<string, TEventHandle>,
    TEventType extends keyof TEventDefine = keyof TEventDefine,
> {
    private readonly HandlesMap: Map<TEventType, Set<TEventHandle>> = new Map();

    on<T extends TEventType>(type: T, handle: TEventDefine[T]): void {
        let handles = this.HandlesMap.get(type);
        if (!handles) {
            handles = new Set<TEventDefine[T]>();
            this.HandlesMap.set(type, handles);
        }
        handles.add(handle);
    }

    remove<T extends TEventType>(type: T, handle: TEventDefine[T]): void {
        const handlers = this.HandlesMap.get(type);
        if (!handlers || !handlers.has(handle)) {
            console.error(`UnReg for type ${type as string} error`);
            return;
        }
        handlers.delete(handle);
    }

    has<T extends TEventType>(type: T, handle: TEventDefine[T]): boolean {
        const handlers = this.HandlesMap.get(type);
        return !!handlers?.has(handle);
    }

    emit<T extends TEventType>(type: T, ...params: TEventHandleParams<TEventDefine[T]>): void {
        const handles = this.HandlesMap.get(type);
        if (handles) {
            handles.forEach((handle) => {
                handle(...params);
            });
        }
    }
}
