import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class BaseCard extends Component<HTMLElement> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
    }

    protected formatPrice(price: number | null): string {
        return price === null ? 'Бесценно' : `${price} синапсов`;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }
}