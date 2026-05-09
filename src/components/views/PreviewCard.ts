import { Card } from './Card';
import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class PreviewCard extends Card<IProduct> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected isInBasket: boolean = false;

    constructor(
        container: HTMLElement,
        events: IEventEmitter,
        productId: string
    ) {
        super(container, events, productId);
        
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
        
        // Клик по кнопке "В корзину"
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            events.emit('preview:addToBasket', { id: productId });
        });
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            super.render(data);
            
            // Описание
            if (data.description && this.descriptionElement) {
                this.setText(this.descriptionElement, data.description);
            }
            
            // Обновление кнопки
            if (data.price !== undefined) {
                const isAvailable = data.price !== null && data.price > 0;
                
                if (!isAvailable) {
                    this.setText(this.buttonElement, 'Нет в наличии');
                    this.setDisabled(this.buttonElement, true);
                } else if (this.isInBasket) {
                    this.setText(this.buttonElement, 'Уже в корзине');
                    this.setDisabled(this.buttonElement, true);
                } else {
                    this.setText(this.buttonElement, 'В корзину');
                    this.setDisabled(this.buttonElement, false);
                }
            }
        }
        return this.container;
    }

    setInBasket(state: boolean): void {
        this.isInBasket = state;
        this.render();
    }
}