import { IBasket, IOrder, IProduct } from '../types';
import { IEvents } from './base/events';
import { IFormState } from './base/form';

const emptyFormState: IFormState = {
	valid: false,
	errors: [],
};

// Хранилище данных приложения
// Здесь находятся данные, которые доступны сразу нескольким частям приложения
export class AppState {
	basket: IBasket = {
		contents: [],
		total: 0,
	};
	// Это необходимо, чтобы сделать копию пустого объекта
	// То есть чтобы у нас сохранялся пустой объект emptyFormState,
	// который мы можем потом заново использовать и не создавать новый пустой объект
	orderFormState: IFormState = Object.create(emptyFormState);
	order: IOrder = {};

	constructor(protected events: IEvents) {}

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
		this.events.emit('basket:changed');
	}

	clearOrder() {
		this.order = Object.create(emptyFormState);
	}

	upDateOrder(field: string, value: any) {

        let errors = '';
        let valid = true;

		switch (field) {
			case 'address': {
				if (value.length === 0) {
					errors = 'Необходимо указать адрес';
					valid = false;
				} else {
					this.order.address = value;
				}
				break;
			}
			case 'payment': {
				if (!value) {
					errors = 'Необходимо указать способ оплаты';
					valid = false;
				} else {
					this.order.payment = value;
				}
				break;
			}
			case 'email': {
				if (value.length === 0) {
					errors = 'Необходимо указать почту';
					valid = false;
				} else {
					this.order.email = value;
				}
				break;
			}
			case 'phone': {
				if (value.length < 10) {
					errors = 'Необходимо указать телефон';
					valid = false;
				} else {
					this.order.phone = value;
				}
				break;
			}
		}

        if (!valid){
            this.events.emit('order:invalid', {errors});
        }
	}
}
