import { BaseCard, IBaseCardState } from './common/BaseCard';
import { ensureElement } from '../../utils/utils';

export interface IBasketCardState extends IBaseCardState {
    index: number;
}

export class BasketCard extends BaseCard<IBasketCardState> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.deleteButton.addEventListener('click', onDelete);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}