import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class ProductsCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(private events: IEventEmitter) {}

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
        this.events.emit('catalog:selectedChanged');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}