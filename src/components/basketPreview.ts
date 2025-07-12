import { IBasket } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


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
    
    set 

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
}

export class BasketCreator {
    private readonly template: HTMLTemplateElement;
    private readonly showProductModal: (basketData: IBasket) => void;

    constructor(
        template: HTMLTemplateElement,
        modalHandler: (basketData: IBasket) => void = (basketData) => console.log('Selected product:', product)
    ) {
        this.template = template;
        this.showProductModal = modalHandler;
    }

    public createBasket(basketData: IBasket): HTMLElement {
        // Клонируем шаблон
        const basketElement = cloneTemplate<HTMLElement>(this.template);

        // Создаем экземпляр карточки
        const basket = new Basket('basket', basketElement, {
            onClick: () => this.showProductModal(basketData)
        });
        this.populateCardData(basket, basketData);

        return basketElement;
    }

    private populateCardData(basket: Basket, basketData: IBasket): void {
        basket.total = basketData.total;
        basket.list = basketData.list;
    }
}