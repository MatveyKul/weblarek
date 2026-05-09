// Тип для колбэка события
type TEventCallback = (data?: any) => void;

// Интерфейс брокера событий
export interface IEventEmitter {
    on(event: string, callback: TEventCallback): void;
    off(event: string, callback: TEventCallback): void;
    emit(event: string, data?: any): void;
}

// Реализация брокера событий
export class EventEmitter implements IEventEmitter {
    private events: Map<string, TEventCallback[]> = new Map();

    on(event: string, callback: TEventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    off(event: string, callback: TEventCallback): void {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event: string, data?: any): void {
        if (!this.events.has(event)) return;
        
        this.events.get(event)!.forEach(callback => {
            callback(data);
        });
    }
}