import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<HTMLElement> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEventEmitter) {
        super(container);
        this.listElement = ensureElement('.basket__list', container);
        this.priceElement = ensureElement('.basket__price', container);
        this.orderButton = ensureElement('.basket__button', container) as HTMLButtonElement;

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
        if (value === 0) {
            this.orderButton.setAttribute('disabled', 'disabled');
        } else {
            this.orderButton.removeAttribute('disabled');
        }
    }
}