//карточка товара
export interface IProductItem  {
    category: string;
    title: string;
    img: string;
    price: number| null;
    description?: string;
}

// открытие модалки из карточки
export interface ICardAction{
    onClick(event:MouseEvent): void;
}


type Payment = 'card' | 'cash';
// формы заполенения данных клиентом
export interface IOrder {
    adress?: string;
    payment?: Payment;
    email?: string;
    phone?: string;
}



//корзина
export interface IBasket{
    id: number;
    title: string;
    price: number|null;
    count: number;
}