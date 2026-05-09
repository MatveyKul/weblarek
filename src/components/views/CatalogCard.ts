import { Card } from './Card';
import { IProduct } from '../../types';
import { IEventEmitter } from '../base/Events';

export class CatalogCard extends Card<IProduct> {
    constructor(
        container: HTMLElement,
        events: IEventEmitter,
        productId: string
    ) {
        super(container, events, productId);
        
        // Клик по карточке генерирует событие
        this.container.addEventListener('click', () => {
            events.emit('card:select', { id: productId });
        });
    }
}