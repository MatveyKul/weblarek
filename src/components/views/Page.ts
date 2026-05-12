import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<HTMLElement> {
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
}