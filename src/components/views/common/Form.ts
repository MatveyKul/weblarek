import { Component } from '../../base/Component';
import { IEventEmitter } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export abstract class Form extends Component<HTMLFormElement> {
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

    protected showErrors(errors: string[]): void {
        this.errorsContainer.textContent = errors.join(', ');
    }

    protected setSubmitDisabled(disabled: boolean): void {
        if (disabled) {
            this.submitButton.setAttribute('disabled', 'disabled');
        } else {
            this.submitButton.removeAttribute('disabled');
        }
    }
}