export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    get element(): HTMLElement {
        return this.container;
    }

    // Утилитарные методы
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) element.textContent = String(value ?? '');
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (!element) return;
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    protected setHidden(element: HTMLElement, state: boolean): void {
        if (element) element.style.display = state ? 'none' : '';
    }

    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (element) element.classList.toggle(className, force);
    }

    // Метод render использует дженерик T
    render(data?: Partial<T>): HTMLElement {
        if (data) Object.assign(this, data);
        return this.container;
    }
}