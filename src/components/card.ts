import { ICard, ICardAction } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card<T> extends Component<ICard> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price:HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardAction) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);

        if (actions?.onClick) { //слушатель на кнопку или на весь контейнер
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
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

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
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

    }
}