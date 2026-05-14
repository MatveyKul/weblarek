import { BaseCard } from './common/BaseCard';
import { IEventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends BaseCard {
    private descriptionElement: HTMLElement;
    private categoryElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private imageElement: HTMLImageElement;
    private productId: string;

    constructor(container: HTMLElement, events: IEventEmitter, productId: string) {
        super(container);
        this.productId = productId;
        this.descriptionElement = ensureElement('.card__text', container);
        this.categoryElement = ensureElement('.card__category', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            events.emit('preview:addToBasket', { id: this.productId });
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

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        this.imageElement.src = value;
    }

    set buttonLabel(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}