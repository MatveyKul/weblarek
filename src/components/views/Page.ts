import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';

export interface IPageData {
    counter: number;
    items: HTMLElement[];
}

export class Page extends Component<IPageData> {
    protected galleryElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter
    ) {
        super(container);
        
        this.galleryElement = container.querySelector('.gallery') as HTMLElement;
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
        
        this.basketButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value ?? '');
        }
    }

    protected renderGallery(items: HTMLElement[]): void {
        if (this.galleryElement) {
            this.galleryElement.innerHTML = '';
            items.forEach(item => {
                this.galleryElement.appendChild(item);
            });
        }
    }

    render(data?: Partial<IPageData>): HTMLElement {
        if (data) {
            if (data.counter !== undefined) {
                this.setText(this.counterElement, String(data.counter));
            }
            
            if (data.items !== undefined) {
                this.renderGallery(data.items);
            }
        }
        return this.container;
    }
}