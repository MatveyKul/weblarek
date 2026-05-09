import { Form } from './common/Form';
import { IEventEmitter } from '../base/Events';
import { TPayment } from '../../types';

export interface IOrderData {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderData> {
    protected paymentButtons: Map<string, HTMLButtonElement> = new Map();
    protected addressInput: HTMLInputElement;
    protected selectedPayment: TPayment | null = null;

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container, events, 'order');
        
        this.addressInput = this.inputs.get('address') as HTMLInputElement;
        
        const cardButton = this.inputs.get('card') as HTMLButtonElement;
        const cashButton = this.inputs.get('cash') as HTMLButtonElement;
        
        if (cardButton) this.paymentButtons.set('online', cardButton);
        if (cashButton) this.paymentButtons.set('cash', cashButton);
    }

    protected onInputChange(field: string, value: string): void {
        // Обработка изменения адреса
    }

    protected onButtonClick(name: string): void {
        if (name === 'card') {
            this.selectedPayment = 'online';
            this.updatePaymentButtons('online');
        } else if (name === 'cash') {
            this.selectedPayment = 'cash';
            this.updatePaymentButtons('cash');
        }
    }

    protected updatePaymentButtons(selected: TPayment): void {
        this.paymentButtons.forEach((button, type) => {
            this.toggleClass(button, 'button_alt-active', type === selected);
        });
    }

    protected validate(): boolean {
        const isValid = this.selectedPayment !== null && 
                       this.addressInput && 
                       this.addressInput.value.trim().length > 0;
        
        this.setSubmitDisabled(!isValid);
        return isValid;
    }

    protected collectData(): IOrderData {
        return {
            payment: this.selectedPayment,
            address: this.addressInput?.value || ''
        };
    }
}