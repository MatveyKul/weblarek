// types/index.ts

export type TPayment = 'online' | 'cash';

export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    description: string;
    image: string;
}

export interface IBuyer {
    payment: TPayment | null;
    address: string;
    phone: string;
    email: string;
}

export type TBuyerValidationErrors = {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
};

export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductResponse {
    items: IProduct[];
    total: number;
}

export interface IApi {
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейсы для данных компонентов
export interface ICardData {
    id?: string;
    title: string;
    price: number | null;
    category?: string;
    image?: string;
    description?: string;
    index?: number;
    buttonLabel?: string;
    buttonDisabled?: boolean;
}

export interface IFormData {
    valid?: boolean;
    errors?: string[];
    payment?: TPayment | null;
    address?: string;
    email?: string;
    phone?: string;
}

export interface ISuccessData {
    total: number;
}