import { BaseCard } from './common/BaseCard';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends BaseCard {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    private productId: string = '';

    constructor(container: HTMLElement, events: IEventEmitter, productId: string) {
        super(container);

        this.productId = productId;
        this.indexElement = ensureElement('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            events.emit('basket:removeItem', { id: this.productId });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.productId = value;
    }
}
