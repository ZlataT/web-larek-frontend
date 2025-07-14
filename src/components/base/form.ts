import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "./events";

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents, protected _formName: string) {
		super(container as HTMLFormElement);
		// Для всех форм сразу у нас есть кнопка отправить и список ошибок
		this._submit = ensureElement<HTMLButtonElement>('.button[type=submit]', container);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		// Когда мы используем любое поле формы, обновляется не только оно,
		// но сразу вся форма - поэтому можно не слушать ввод у каждого поля, 
		// а сразу у всей формы - удобно и в одном месте
		this.container.addEventListener('input', (e: Event) => {
			// Здесь мы достаём из события название поля и его значение
			// По сути вся эта кракозябра нужна просто чтобы удовлетворить строгие типы
			// на деле, концептуально, тут всё просто
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T; 
			const value = target.value;
			this.events.emit(`${_formName}:input`, {field, value});
		});

		this.container.addEventListener('submit', (e: Event) => {
			// Это нужно чтобы страница не перезагрузилась
			e.preventDefault();
			this.events.emit(`${_formName}:submit`);
		});
	}

	set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Этот тип означает, что дата является суммой какой-то части типа Т и всего типа АйФормСтейт
	// то есть в ней будут все поля АйФормСтейт, но только некоторые из Т
	render(data: Partial<T> & IFormState) {
		// Это называется деконструкция - дата это объект, в котором есть поля
		// и вот мы хотим эти поля, а не саму дату
		const { valid, errors, ...inputs } = data;
		super.render({ valid, errors });
		// Засунь все поля из инпут в зис
		Object.assign(this, inputs);
		return this.container;
	}
}