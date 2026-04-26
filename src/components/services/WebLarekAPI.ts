import { Api } from '../base/Api';
import { IProductResponse, IOrder, IOrderResult, IApi } from '../../types';

export class WebLarekAPI implements IApi {
    private _api: Api;
    
    constructor(baseUrl: string, options?: RequestInit) {
        this._api = new Api(baseUrl, options);
    }

    async getProducts(): Promise<IProductResponse> {
        return this._api.get('/product/');
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post('/order/', order);
    }
}