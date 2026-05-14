// components/views/common/Modal.ts
import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

interface IModalData {
    content: HTMLElement;
    visible: boolean;
}

export class Modal extends Component<IModalData> {
    private modalElement: HTMLElement;
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEventEmitter) {
        super(container);
        this.modalElement = container;
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => {
            this.visible = false;
        });
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
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
            this.modalElement.classList.add('modal_active');
        } else {
            this.modalElement.classList.remove('modal_active');
            this.events.emit('modal:closed');
        }
    }

    render(data?: Partial<IModalData>): HTMLElement {
        if (data) {
            if (data.content !== undefined) this.content = data.content;
            if (data.visible !== undefined) this.visible = data.visible;
        }
        return this.container;
    }
}