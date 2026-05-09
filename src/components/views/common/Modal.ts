import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
    protected modalElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected isOpen: boolean = false;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter
    ) {
        super(container);
        
        this.modalElement = container;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        
        // Закрытие по крестику
        this.closeButton.addEventListener('click', () => this.close());
        
        // Закрытие по оверлею
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    setContent(content: HTMLElement): void {
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(content);
        }
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

    render(data?: { content: HTMLElement }): HTMLElement {
        if (data && data.content) {
            this.setContent(data.content);
        }
        return this.container;
    }
}