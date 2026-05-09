import { IBuyer, TPayment, TBuyerValidationErrors } from '../../types';
import { IEventEmitter } from '../base/Events';

export class Customer {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(private events: IEventEmitter) {}

    setData(data: Partial<IBuyer>): void {
        let changed = false;
        
        if (data.payment !== undefined && this.payment !== data.payment) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.address !== undefined && this.address !== data.address) {
            this.address = data.address;
            changed = true;
        }
        if (data.phone !== undefined && this.phone !== data.phone) {
            this.phone = data.phone;
            changed = true;
        }
        if (data.email !== undefined && this.email !== data.email) {
            this.email = data.email;
            changed = true;
        }
        
        if (changed) {
            this.emitChange();
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clearData(): void {
        const hadData = this.payment !== null || 
                       this.address !== '' || 
                       this.phone !== '' || 
                       this.email !== '';
        
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
        
        if (hadData) {
            this.emitChange();
        }
    }

    validate(): TBuyerValidationErrors {
        const errors: TBuyerValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }

    // Приватный метод для генерации событий при изменении данных
    private emitChange(): void {
        this.events.emit('customer:changed', this.getData());
    }
}