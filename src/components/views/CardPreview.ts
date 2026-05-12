import { BaseCard } from './BaseCard';
import { IEventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends BaseCard {
    private descriptionElement: HTMLElement;
    private categoryElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private imageElement: HTMLImageElement;
    private inBasket: boolean = false;

    constructor(container: HTMLElement, events: IEventEmitter, private productId: string) {
        super(container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.categoryElement = ensureElement('.card__category', container);
        this.buttonElement = ensureElement('.card__button', container) as HTMLButtonElement;
        this.imageElement = ensureElement('.card__image', container) as HTMLImageElement;

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.inBasket) {
                events.emit('preview:removeFromBasket', { id: this.productId });
            } else {
                events.emit('preview:addToBasket', { id: this.productId });
            }
        });
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

    set buttonState(state: 'available' | 'inBasket' | 'unavailable') {
        this.inBasket = state === 'inBasket';
        switch (state) {
            case 'available':
                this.buttonElement.textContent = 'В корзину';
                this.buttonElement.disabled = false;
                break;
            case 'inBasket':
                this.buttonElement.textContent = 'Уже в корзине';
                this.buttonElement.disabled = false;
                break;
            case 'unavailable':
                this.buttonElement.textContent = 'Недоступно';
                this.buttonElement.disabled = true;
                break;
        }
    }
}