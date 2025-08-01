import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// Отвечает за блокировку скролла, кнопку корзины и за список товара
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}