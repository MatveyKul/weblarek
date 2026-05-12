import { Component } from '../base/Component';

export class Gallery extends Component<HTMLElement> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(elements: HTMLElement[]) {
        this.container.innerHTML = '';
        elements.forEach(el => this.container.appendChild(el));
    }
}