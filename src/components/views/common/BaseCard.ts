import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface IBaseCardState {
    title: string;
    price: number | null;
}

export abstract class BaseCard<T extends IBaseCardState> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected productId?: string;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
    }

    set id(value: string) {
        this.productId = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}