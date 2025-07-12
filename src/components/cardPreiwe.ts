import { ICard } from "../types";
import { cloneTemplate } from "../utils/utils";
import { Card } from "./card";


export class CardCreator {
    private readonly template: HTMLTemplateElement;
    private readonly showProductModal: (product: ICard) => void;

    constructor(
        template: HTMLTemplateElement,
        modalHandler: (product: ICard) => void = (product) => console.log('Selected product:', product)
    ) {
        this.template = template;
        this.showProductModal = modalHandler;
    }

    public createCard(product: ICard): HTMLElement {
        // Клонируем шаблон
        const cardElement = cloneTemplate<HTMLElement>(this.template);

        // Создаем экземпляр карточки
        const card = new Card('card', cardElement, {
            onClick: () => this.showProductModal(product)
        });

        this.populateCardData(card, product);

        return cardElement;
    }

    private populateCardData(card: Card, product: ICard): void {
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        
        if (product.description) {
            card.description = product.description;
        }
    }

    public createCards(products: ICard[]): HTMLElement[] {
        return products.map(product => this.createCard(product));
    }
}