import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    protected _basketIndex: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, action: () => void) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);

        this._basketIndex = container.querySelector(`.basket__item-index`);
        this._image = container.querySelector(`.card__image`);
        this._button = container.querySelector(`.card__button`);
        this._description = container.querySelector(`.card__text`);
        this._category = container.querySelector(`.card__category`);

        // Если есть кнопка, то действие ставим на кнопку
        // Если её нет - то на всю карточку
        if (this._button) {
            this._button.addEventListener('click', action);
        } else {
            container.addEventListener('click', action);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set basketIndex(value: number) {
        this.setText(this._basketIndex, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set price(value: number | null) {
        if (value !== null) {
            this.setText(this._price, `${value} синапсов`);
        } else {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this._button.disabled = true;
            }
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        this.removeClass(this._category, 'card__category_soft');
        switch (value) {
            case 'софт-скил': {
                this.addClass(this._category, 'card__category_soft');
                break;
            }

            case 'другое': {
                this.addClass(this._category, 'card__category_other');

                break;
            }

            case 'дополнительное': {
                this.addClass(this._category, 'card__category_additional');
                break;
            }

            case 'кнопка': {
                this.addClass(this._category, 'card__category_button');
                break;
            }
            case 'хард-скил': {
                this.addClass(this._category, 'card__category_hard');
                break;
            }
        }
    }
}