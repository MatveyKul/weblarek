import { BaseCard } from './common/BaseCard';
import { IEventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends BaseCard {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private productId: string;

    constructor(container: HTMLElement, events: IEventEmitter, productId: string) {
        super(container);
        this.productId = productId;
        this.categoryElement = ensureElement('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.element.addEventListener('click', () => {
            events.emit('card:select', { id: this.productId });
        });
    }

    set id(value: string) {
        this.productId = value;
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