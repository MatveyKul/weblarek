import { BaseCard } from './BaseCard';
import { IEventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CatalogCard extends BaseCard {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEventEmitter, private productId: string) {
        super(container);
        this.categoryElement = ensureElement('.card__category', container);
        this.imageElement = ensureElement('.card__image', container) as HTMLImageElement;

        this.container.addEventListener('click', () => {
            events.emit('card:select', { id: this.productId });
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) this.categoryElement.classList.add(modifier);
    }

    set image(value: string) {
        this.imageElement.src = value;
    }
}