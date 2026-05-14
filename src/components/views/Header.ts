// components/views/Header.ts
import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEventEmitter) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement('.header__basket-counter', container);

        this.basketButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }

    render(data?: Partial<IHeaderData>): HTMLElement {
        if (data && data.counter !== undefined) {
            this.counter = data.counter;
        }
        return this.container;
    }
}