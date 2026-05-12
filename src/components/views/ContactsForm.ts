import { Form } from './common/Form';
import { IEventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form {
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

    setEmail(email: string): void {
        this.emailInput.value = email;
    }

    setPhone(phone: string): void {
        this.phoneInput.value = phone;
    }

    setValidationErrors(errors: string[]): void {
        this.showErrors(errors);
    }

    setPayButtonEnabled(enabled: boolean): void {
        this.setSubmitDisabled(!enabled);
    }
}