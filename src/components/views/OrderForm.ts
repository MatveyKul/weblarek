import { Form, IFormState } from './common/Form';
import { IEventEmitter } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormState extends IFormState {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormState> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEventEmitter) {
        super(container, events, 'order');

        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', container);

        this.cardButton.addEventListener('click', () => {
            events.emit('order:paymentSelected', { payment: 'online' });
        });
        this.cashButton.addEventListener('click', () => {
            events.emit('order:paymentSelected', { payment: 'cash' });
        });
        this.addressInput.addEventListener('input', () => {
            events.emit('order:addressChanged', { address: this.addressInput.value });
        });
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'online');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}