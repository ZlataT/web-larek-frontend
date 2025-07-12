//карточка товара
export interface ICard  {
    id: string;
    category: string;
    title: string;
    image: string;
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

export interface IOrderResult {
    id: string;
    total: number;
}

//для запроса каталога товаров
export interface IProductListResponse {
    map(createCard: (product: ICard) => HTMLElement): unknown;
    total: number;    // Общее количество товаров
    items: ICard[]; // Массив товаров
}

export interface ISuccess{
    id: string;
	total: number;
}