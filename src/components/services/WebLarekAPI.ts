// components/services/WebLarekAPI.ts
import { IApi, IProductResponse, IOrder, IOrderResult } from '../../types';

export class WebLarekAPI {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>('/product/');
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}