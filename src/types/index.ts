export type TPayment = 'online' | 'cash';

export interface IApi {
    getProducts(): Promise<IProductResponse>;
    postOrder(order: IOrder): Promise<IOrderResult>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductResponse {
    total: number;
    items: IProduct[];
}

// Новый тип для ошибок валидации
export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;