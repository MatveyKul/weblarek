import { BaseCard, IBaseCardState } from './common/BaseCard';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardCatalogState extends IBaseCardState {
    category: string;
    image: string;
}

export class CardCatalog extends BaseCard<ICardCatalogState> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.categoryElement = ensureElement('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.element.addEventListener('click', onClick);
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