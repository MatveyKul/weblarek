import { Component } from '../base/Component';
import { IEventEmitter } from '../base/Events';

export interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter
    ) {
        super(container);
        
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        
        this.closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value ?? '');
        }
    }

    render(data?: Partial<ISuccessData>): HTMLElement {
        if (data && data.total !== undefined) {
            this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);
        }
        return this.container;
    }
}