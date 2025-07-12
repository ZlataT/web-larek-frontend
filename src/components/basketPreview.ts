import { IBasket, ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { CardBasket } from "./card";


export class Basket extends Component<IBasket>{
    protected _list :HTMLElement;
    protected _total: HTMLElement;
    protected _button:HTMLButtonElement;

    constructor(protected blockName: string, conteiner:HTMLElement, events:IEvents){
        super(conteiner);
        this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`,this.container);
        this._list = ensureElement<HTMLElement>(`.${blockName}__list`,this.container);
        this._total = ensureElement<HTMLElement>(`.${blockName}__total`,this.container);
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    set button(value: string) {
		this.setText(this._button, value);
	}

    set items(items:ICard[]){
        const item = items.map((item,index) =>{
            const card = new CardBasket(this._list,(id: string) => (event: MouseEvent) => {})
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            card.id = item.id;

            return card.render();
        });

        this._list.replaceChildren(...item);
    }
}
