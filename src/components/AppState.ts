import { IBasket, IOrder, IProduct } from '../types';
import { IEvents } from './base/events';
import { IFormState } from './base/form';

// Хранилище данных приложения
// Здесь находятся данные, которые доступны сразу нескольким частям приложения
export class AppState {
	products: IProduct[];
	basket: IBasket = {
		contents: [],
		total: 0,
	};
	order: IOrder = {};

	constructor(protected events: IEvents) {}

	updateProducts(products: IProduct[]) {
		this.products = products;
		this.events.emit('products:changed');
	}

	// Каждый раз когда содержимое корзины меняется нам нужно обновить отображение корзины
	// Это мы делаем, как и всё остальное, с помощью событий
	// Здесь же мы вычисляем и сумму заказа
	addToBasket(product: IProduct) {
		this.basket.contents.push(product);
		this.basket.total += product.price;
		this.events.emit('basket:changed');
	}

	removeFromBasket(product: IProduct) {
		const index = this.basket.contents.indexOf(product);
		this.basket.contents.splice(index, 1);
		this.basket.total -= product.price;
		this.events.emit('basket:changed');
	}

	clearBasket() {
		this.basket.contents = [];
		this.basket.total = 0;
		this.events.emit('basket:changed');
	}

	clearOrder() {
		this.order = {};
	}

	updateOrder(field: string, value: any) {	
		switch (field) {
			case 'address': {
				this.order.address = value;
				break;
			}
			case 'payment': {
				this.order.payment = value;
				break;
			}
		}

        this.events.emit('order:changed');
	}
	
	validateOrder() {
		let errors: string[] = [];
		if (!this.order.address) {
			errors.push('Необходимо указать адрес');
		}
		if (!this.order.payment) {
			errors.push('Необходимо указать способ оплаты');
		}

        this.events.emit('order:validated', { errors, valid: errors.length === 0 } as IFormState);
	}

	updateContacts(field: string, value: any) {
		switch (field) {
			case 'email': {
				this.order.email = value;
				break;
			}
			case 'phone': {
				this.order.phone = value;
				break;
			}
		}

        this.events.emit('contacts:changed');
	}

	validateContacts() {
		let errors: string[] = [];
		if (!this.order.email) {
			errors.push('Необходимо указать почту');
		}
		if (!(this.order.phone && this.order.phone.length === 10)) {
			errors.push('Необходимо указать телефон');
		}

        this.events.emit('contacts:validated', { errors, valid: errors.length === 0 } as IFormState);
	}
}
