import { Component } from '../base/Component';

export interface IGalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(elements: HTMLElement[]) {
        this.container.replaceChildren(...elements);
    }
}