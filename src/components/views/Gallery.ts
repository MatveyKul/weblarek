// components/views/Gallery.ts
import { Component } from '../base/Component';

interface IGalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(elements: HTMLElement[]) {
        this.container.innerHTML = '';
        elements.forEach(el => this.container.appendChild(el));
    }

    render(data?: Partial<IGalleryData>): HTMLElement {
        if (data && data.items !== undefined) {
            this.items = data.items;
        }
        return this.container;
    }
}