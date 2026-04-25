import { IProduct } from '../../types';

export class Basket {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this._items];
    }

    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this._items.push(product);
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
    }

    clearBasket(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    containsItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}