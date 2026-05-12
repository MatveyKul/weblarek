import { BaseCard } from './BaseCard';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends BaseCard {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEventEmitter, protected productId: string) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.deleteButton = ensureElement('.basket__item-delete', container) as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            events.emit('basket:removeItem', { id: this.productId });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}