import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class BasketCard extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter,
        protected productId: string,
        index: number
    ) {
        super(container);
        
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        // Установка индекса
        if (this.indexElement) {
            this.indexElement.textContent = String(index);
        }
        
        // Обработчик удаления
        this.deleteButton.addEventListener('click', () => {
            events.emit('basket:removeItem', { id: productId });
        });
    }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value ?? '');
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title) {
                this.setText(this.titleElement, data.title);
            }
            
            if (data.price !== undefined) {
                const priceText = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
                this.setText(this.priceElement, priceText);
            }
        }
        return this.container;
    }
}