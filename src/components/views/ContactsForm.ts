import { Form, IFormState } from './common/Form';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEventEmitter) {
        super(container, events, 'contacts');

        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            events.emit('contacts:emailChanged', { email: this.emailInput.value });
        });
        this.phoneInput.addEventListener('input', () => {
            events.emit('contacts:phoneChanged', { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}