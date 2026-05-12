import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private events: IEventEmitter) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this.items.push(product);
            this.emitChange();
        }
    }

    removeItem(productId: string): void {
        const wasContained = this.containsItem(productId);
        this.items = this.items.filter(item => item.id !== productId);
        if (wasContained) {
            this.emitChange();
        }
    }

    clearBasket(): void {
        if (this.items.length > 0) {
            this.items = [];
            this.emitChange();
        }
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    containsItem(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    // Приватный метод для генерации событий при изменении корзины
    private emitChange(): void {
        this.events.emit('basket:changed'); // ← НЕ передаём данные!
    }
}