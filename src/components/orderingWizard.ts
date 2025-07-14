import { IOrder, ISuccess } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Form } from "./base/form";

// Первый шаг в мастере заказа - метод оплаты и адрес
export class Order extends Form<IOrder> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events, 'order');

        this._cardButton = ensureElement<HTMLButtonElement>(`.button[name='card']`, container);
        this._cashButton = ensureElement<HTMLButtonElement>(`.button[name='cash']`, container);

        // От нас хотят чтобы кнопка вела себя как радио-кнопка
        // Значит нужно руками самостоятельно её фиксировать в нажатом положении
        // И самостоятельно отправлять данные на валидацию
        this._cardButton.addEventListener('click', (e: MouseEvent) => {
            this.addClass(this._cardButton, 'button_alt-active');
            this.removeClass(this._cashButton, 'button_alt-active');
            this.events.emit('order:input', { field:'payment', value:'card' });
        });

        this._cashButton.addEventListener('click', (e: MouseEvent) => {
            this.addClass(this._cashButton, 'button_alt-active');
            this.removeClass(this._cardButton, 'button_alt-active');
            this.events.emit('order:input', { field:'payment', value:'cash' });
        });
    }

}

// Второй шаг в мастере заказа - почта и телефон
export class Contacts extends Form<IOrder> {
	constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events, 'contacts');
    }
}

// Третий шаг в мастере заказа - доклад об успешной отправке заказа
export class Success extends Component<ISuccess> {
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>(`.order-success__close`, container);
        this._total = ensureElement<HTMLElement>(`.order-success__description`, container);

        this._button.addEventListener('click', (e: MouseEvent) => {
            events.emit('success:submit');
        });
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}