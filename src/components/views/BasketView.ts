import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketViewState {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export class BasketView extends Component<IBasketViewState> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEventEmitter) {
        super(container);
        this.listElement = ensureElement('.basket__list', container);
        this.priceElement = ensureElement('.basket__price', container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.orderButton.addEventListener('click', () => {
            events.emit('basket:order');
        });
    }

    set items(elements: HTMLElement[]) {
        this.listElement.replaceChildren(...elements);
    }

    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set valid(value: boolean) {
        this.orderButton.disabled = !value;
    }
}