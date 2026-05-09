import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class ProductsCatalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(private events: IEventEmitter) {}

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed', {
            products: this.getProducts(),
            total: this._products.length
        });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        const oldSelected = this._selectedProduct;
        this._selectedProduct = product;
        
        // Генерируем событие только если выбран другой товар
        if (oldSelected?.id !== product?.id) {
            this.events.emit('catalog:selectedChanged', {
                selected: this.getSelectedProduct()
            });
        }
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    // Дополнительный метод для обновления одного товара (например, при изменении цены)
    updateProduct(productId: string, updates: Partial<IProduct>): void {
        const index = this._products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this._products[index] = { ...this._products[index], ...updates };
            this.events.emit('catalog:productUpdated', {
                product: this._products[index]
            });
        }
    }
}