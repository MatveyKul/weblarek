import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form extends Component<IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEventEmitter, protected formName: string) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', container);
        this.errorsContainer = ensureElement('.form__errors', container);

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${formName}:submit`);
        });
    }

    protected set errors(errors: string[]) {
        this.errorsContainer.textContent = errors.join(', ');
    }

    protected set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}