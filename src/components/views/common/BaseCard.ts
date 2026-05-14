import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export abstract class BaseCard extends Component<HTMLElement> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        const formattedPrice = value === null ? 'Бесценно' : `${value} синапсов`;
        this.priceElement.textContent = formattedPrice;
    }
}
