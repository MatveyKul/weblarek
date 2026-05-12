import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export class Modal extends Component<HTMLElement> {
    private modalElement: HTMLElement;
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private isOpen = false;

    constructor(container: HTMLElement, private events: IEventEmitter) {
        super(container);
        this.modalElement = container;
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => this.close());
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(value);
    }

    get currentContent(): HTMLElement | null {
        return this.contentElement.firstElementChild as HTMLElement;
    }

    open(): void {
        this.modalElement.classList.add('modal_active');
        this.isOpen = true;
    }

    close(): void {
        this.modalElement.classList.remove('modal_active');
        this.isOpen = false;
        this.events.emit('modal:closed');
    }
}