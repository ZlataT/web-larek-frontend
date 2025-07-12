import { IBasket, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasket> {
    protected _total: HTMLElement;
    protected _productCards: HTMLUListElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._total = ensureElement<HTMLElement>(`.basket__price`, container);
        this._productCards = ensureElement<HTMLUListElement>(`.basket__list`, container);
        this._button = ensureElement<HTMLButtonElement>(`.basket__button`, container);

        // Для управления приложением мы используем систему событий
        this._button.addEventListener('click', event => events.emit('basket:order'));
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    // Если карточки есть - отображаем их, иначе просто текст
    set productCards(cards: HTMLElement[]) {
        if (cards.length > 0) {
            this._productCards.replaceChildren(...cards);
            this.setDisabled(this._button, false);
        } else {
            this.setText(this._productCards, 'Корзина пуста');
            this.setDisabled(this._button, true);
        }
    }
}