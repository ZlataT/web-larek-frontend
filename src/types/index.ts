export interface IProduct  {
    id: string;
    category: string;
    title: string;
    image: string;
    price: number | null;
    description?: string;
}

export interface IBasket {
    total: number;
    contents: IProduct[];
}

type Payment = 'card' | 'cash';
export interface IOrder {
    address?: string;
    payment?: Payment;
    email?: string;
    phone?: string;
    total?: number;
    items?: string[];
}

export interface ISuccess {
    id: string;
	total: number;
}