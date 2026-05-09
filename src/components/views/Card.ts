import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEventEmitter } from '../base/Events';

export abstract class Card<T extends IProduct> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter,
        protected cardId?: string
    ) {
        super(container);
        
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    }

    // Установка текста
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value ?? '');
        }
    }

    // Установка статуса disabled
    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    // Переключение класса
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (force !== undefined) {
            element.classList.toggle(className, force);
        } else {
            element.classList.toggle(className);
        }
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            // Обновление заголовка
            if (data.title) {
                this.setText(this.titleElement, data.title);
            }
            
            // Обновление цены
            if (data.price !== undefined) {
                const priceText = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
                this.setText(this.priceElement, priceText);
            }
            
            // Обновление категории
            if (data.category && this.categoryElement) {
                this.setText(this.categoryElement, data.category);
                const modifier = categoryMap[data.category as keyof typeof categoryMap];
                if (modifier) {
                    this.categoryElement.classList.add(modifier);
                }
            }
            
            // Обновление изображения
            if (data.image && this.imageElement) {
                this.setImage(this.imageElement, data.image, data.title);
            }
        }
        return this.container;
    }
}