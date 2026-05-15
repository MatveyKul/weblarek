import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export interface IModalData {
    content: HTMLElement;
    visible: boolean;
}

export class Modal extends Component<IModalData> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEventEmitter) {
        super(container);
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => {
            this.visible = false;
        });
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.visible = false;
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(value);
    }

    set visible(value: boolean) {
        if (value) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
            // Используем events здесь
            this.events.emit('modal:closed');
        }
    }
}