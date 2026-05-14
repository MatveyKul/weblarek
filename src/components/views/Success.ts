// components/views/Success.ts
import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { ISuccessData } from '../../types';

export class Success extends Component<ISuccessData> {
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

    // Переопределяем метод render для правильной типизации
    render(data?: Partial<ISuccessData>): HTMLElement {
        if (data) {
            if (data.total !== undefined) this.total = data.total;
        }
        return this.container;
    }
}