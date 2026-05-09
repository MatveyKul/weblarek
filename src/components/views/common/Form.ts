import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<HTMLFormElement> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    protected inputs: Map<string, HTMLInputElement | HTMLButtonElement> = new Map();

    constructor(
        container: HTMLElement,
        protected events: IEventEmitter,
        protected formName: string
    ) {
        super(container);
        
        this.formElement = container as HTMLFormElement;
        this.submitButton = container.querySelector('.button[type="submit"]') as HTMLButtonElement;
        this.errorsContainer = container.querySelector('.form__errors') as HTMLElement;
        
        // Сбор всех полей формы
        const allInputs = container.querySelectorAll('input[name], button[name]');
        allInputs.forEach(input => {
            if (input instanceof HTMLInputElement || input instanceof HTMLButtonElement) {
                const name = input.getAttribute('name');
                if (name) {
                    this.inputs.set(name, input);
                    
                    if (input instanceof HTMLInputElement) {
                        input.addEventListener('input', () => {
                            this.onInputChange(name, input.value);
                            this.validateAndNotify();
                        });
                    } else if (input instanceof HTMLButtonElement && input.type === 'button') {
                        input.addEventListener('click', () => {
                            this.onButtonClick(name);
                            this.validateAndNotify();
                        });
                    }
                }
            }
        });
        
        // Обработка отправки формы
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                const data = this.collectData();
                this.events.emit(`${formName}:submit`, data);
            }
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

    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (force !== undefined) {
            element.classList.toggle(className, force);
        } else {
            element.classList.toggle(className);
        }
    }

    protected validateAndNotify(): void {
        const isValid = this.validate();
        this.events.emit(`${this.formName}:change`, { isValid });
    }

    protected abstract onInputChange(field: string, value: string): void;
    protected abstract onButtonClick(name: string): void;
    protected abstract validate(): boolean;
    protected abstract collectData(): T;
    
    protected showErrors(errors: string[]): void {
        if (this.errorsContainer) {
            this.setText(this.errorsContainer, errors.join(', '));
        }
    }
    
    protected setSubmitDisabled(state: boolean): void {
        this.setDisabled(this.submitButton, state);
    }

    reset(): void {
        this.inputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.value = '';
            } else if (input instanceof HTMLButtonElement) {
                this.toggleClass(input, 'button_alt-active', false);
            }
        });
        this.setSubmitDisabled(true);
        this.showErrors([]);
    }

    render(): HTMLElement {
        return this.container;
    }
}