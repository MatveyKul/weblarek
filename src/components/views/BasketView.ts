// components/views/BasketView.ts
import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketViewData {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export class BasketView extends Component<IBasketViewData> {
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
        this.listElement.innerHTML = '';
        elements.forEach(item => this.listElement.appendChild(item));
    }

    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set valid(value: boolean) {
        this.orderButton.disabled = !value;
    }

    render(data?: Partial<IBasketViewData>): HTMLElement {
        if (data) {
            if (data.items !== undefined) this.items = data.items;
            if (data.total !== undefined) this.total = data.total;
            if (data.valid !== undefined) this.valid = data.valid;
        }
        return this.container;
    }
}