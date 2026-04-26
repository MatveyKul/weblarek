import { IBuyer, TPayment, TBuyerValidationErrors } from '../../types';

export class Customer {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;
    }

    getData(): IBuyer {
        return {
            payment: this.payment, // возвращаем как есть, без подмены
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clearData(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
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
}