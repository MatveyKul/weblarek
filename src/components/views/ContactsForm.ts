import { Form } from './common/Form';
import { IEventEmitter } from '../base/Events';

export interface IContactsData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container, events, 'contacts');
        
        this.emailInput = this.inputs.get('email') as HTMLInputElement;
        this.phoneInput = this.inputs.get('phone') as HTMLInputElement;
    }

    protected onInputChange(field: string, value: string): void {
        // Обработка изменений
    }

    protected onButtonClick(name: string): void {
        // Кнопок в этой форме нет
    }

    protected validate(): boolean {
        const email = this.emailInput?.value || '';
        const phone = this.phoneInput?.value || '';
        
        const isValid = this.validateEmail(email) && this.validatePhone(phone);
        this.setSubmitDisabled(!isValid);
        
        const errors: string[] = [];
        if (!this.validateEmail(email)) errors.push('Укажите корректный email');
        if (!this.validatePhone(phone)) errors.push('Укажите корректный телефон');
        this.showErrors(errors);
        
        return isValid;
    }

    protected validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    protected validatePhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }

    protected collectData(): IContactsData {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }
}