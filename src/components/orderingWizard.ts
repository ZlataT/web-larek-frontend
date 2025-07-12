import { IOrder, ISuccess } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Form } from "./base/form";

// Первый шаг в мастере заказа - метод оплаты и адрес
export class Step1 extends Form<IOrder> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, protected events: IEvents, protected order: IOrder) {
        super(container, events, order);

        this._cardButton = ensureElement<HTMLButtonElement>(`.button[name='card']`, container);
        this._cashButton = ensureElement<HTMLButtonElement>(`.button[name='cash']`, container);

        this._cardButton.addEventListener('click', (e: MouseEvent) => {
            this.addClass(this._cardButton, 'button_alt-active');
            this.removeClass(this._cashButton, 'button_alt-active');
            this.onInput('payment', 'card');
        });

        this._cashButton.addEventListener('click', (e: MouseEvent) => {
            this.addClass(this._cashButton, 'button_alt-active');
            this.removeClass(this._cardButton, 'button_alt-active');
            this.onInput('payment', 'cash');
        });
    }

    // Валидируем значение поля и отправляем его в хранилище
    onInput(field: string, value: any) {
        let errors = '';
        let valid = true;
        switch (field) {
            case 'address': {
                if (value.length === 0) {
                    errors = 'Необходимо указать адрес';
                    valid = false;
                } else {
                    this._formData.address = value;
                }
                break;
            };
            case 'payment': {
                if (!value) {
                    errors = 'Необходимо указать способ оплаты';
                    valid = false;
                } else {
                    this._formData.payment = value;
                }
                break;
            };
        }

        this.errors = errors;
        this.valid = valid;
    }

    onSubmit(): void {
        this.events.emit('wizard:toStep2');
    }
}

// Второй шаг в мастере заказа - почта и телефон
export class Step2 extends Form<IOrder> {
	constructor(container: HTMLFormElement, protected events: IEvents, protected order: IOrder) {
        super(container, events, order);
    }

    onInput(field: string, value: any) {
        let errors = '';
        let valid = true;
        switch (field) {
            case 'email': {
                if (value.length === 0) {
                    errors = 'Необходимо указать почту';
                    valid = false;
                } else {
                    this._formData.email = value;
                }
                break;
            };
            case 'phone': {
                if (value.length < 10) {
                    errors = 'Необходимо указать телефон';
                    valid = false;
                } else {
                    this._formData.phone = value;
                }
                break;
            };
        }
        
        this.errors = errors;
        this.valid = valid;
    }

    onSubmit(): void {
        this.events.emit('wizard:submit');
    }
}

// Третий шаг в мастере заказа - доклад об успешной отправке заказа
export class Step3 extends Component<ISuccess> {
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>(`.order-success__close`, container);
        this._total = ensureElement<HTMLElement>(`.order-success__description`, container);

        this._button.addEventListener('click', (e: MouseEvent) => {
            events.emit('wizard:close');
        });
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}