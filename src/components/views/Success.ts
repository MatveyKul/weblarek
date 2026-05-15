import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ISuccessState {
    total: number;
}

export class Success extends Component<ISuccessState> {
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container);
        this.descriptionElement = ensureElement('.order-success__description', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.buttonElement.addEventListener('click', () => events.emit('success:close'));
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}