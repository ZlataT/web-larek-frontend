import {ICardAction, IProductItem} from '../types/index'
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Card extends Component<IProductItem>{
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _cardContainer: HTMLElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container);
        
        this._cardContainer = cloneTemplate<HTMLElement>('.card')
        this._title = ensureElement<HTMLElement>('.card__title');
        this._image = ensureElement<HTMLImageElement>('.card__image');
        this._category = ensureElement<HTMLElement>('.card__category');
        this._price = ensureElement<HTMLElement>('.card__price');
        
    }
     
    // вешалка открывашки модалки
    if(actions?: ICardAction){
        this._cardContainer.addEventListener('click',actions.onClick);
    }

    render(data?: Partial<IProductItem>): HTMLElement {
        super.render(data); // Вызываем родительский render для обновления данных
        
        // Устанавливаем значения в DOM-элементы
        this.setText(this._title, data.title);
        this.setImage(this._image, data.img, data.title);
        this.setText(this._category, data.category);
        this.setText(this._price, data.price ? `${data.price} синапсов` : 'Бесценно');
        
        return this.container;
    }
}

