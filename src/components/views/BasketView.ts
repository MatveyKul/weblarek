import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';

export interface IBasketViewData {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketViewData> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter
    ) {
        super(container);
        
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = container.querySelector('.basket__button') as HTMLButtonElement;
        
        this.orderButton.addEventListener('click', () => {
            events.emit('basket:order');
        });
    }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value ?? '');
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    protected renderItems(items: HTMLElement[]): void {
        if (this.listElement) {
            this.listElement.innerHTML = '';
            items.forEach(item => {
                this.listElement.appendChild(item);
            });
        }
    }

    render(data?: Partial<IBasketViewData>): HTMLElement {
        if (data) {
            if (data.items !== undefined) {
                this.renderItems(data.items);
            }
            
            if (data.total !== undefined) {
                this.setText(this.priceElement, `${data.total} синапсов`);
                this.setDisabled(this.orderButton, data.total === 0);
            }
        }
        return this.container;
    }
}