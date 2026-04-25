import { Api } from '../base/Api';
import { IProductResponse, IOrder, IOrderResult } from '../../types';

export class WebLarekAPI extends Api {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    async getProducts(): Promise<IProductResponse> {
        return this.get('/product/');
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order/', order);
    }
}