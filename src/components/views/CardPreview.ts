import { BaseCard, IBaseCardState } from './common/BaseCard';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardPreviewState extends IBaseCardState {
    category: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonDisabled: boolean;
}

export class CardPreview extends BaseCard<ICardPreviewState> {
    private descriptionElement: HTMLElement;
    private categoryElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onAddToBasket: () => void) {
        super(container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.categoryElement = ensureElement('.card__category', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            onAddToBasket();
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

    set buttonLabel(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}