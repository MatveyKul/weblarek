import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<HTMLElement> {
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container);
        this.descriptionElement = ensureElement('.order-success__description', container);
        this.buttonElement = ensureElement('.order-success__close', container) as HTMLButtonElement;
        this.buttonElement.addEventListener('click', () => events.emit('success:close'));
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}