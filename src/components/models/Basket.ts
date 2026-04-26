import { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items; // возвращаем сами данные, без копирования
    }

    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this.items.push(product);
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    clearBasket(): void {
        this.items = [];
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
}