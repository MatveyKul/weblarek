import { IBuyer, TPayment } from '../../types';

export class Customer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _phone: string = '';
    private _email: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.email !== undefined) this._email = data.email;
    }

    getData(): IBuyer {
        return {
            payment: this._payment ?? 'online', // значение по умолчанию
            address: this._address,
            phone: this._phone,
            email: this._email,
        };
    }

    clearData(): void {
        this._payment = null;
        this._address = '';
        this._phone = '';
        this._email = '';
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        } else if (!/^\S+@\S+\.\S+$/.test(this._email)) {
            errors.email = 'Некорректный email';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Укажите телефон';
        } else {
            const digits = this._phone.replace(/[\s\-()]/g, '');
            if (!/^\+?\d{10,15}$/.test(digits)) {
                errors.phone = 'Некорректный номер телефона';
            }
        }

        return errors;
    }
}