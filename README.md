# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Документация
Три слоя
- Отображение (View) - взаимодействие с пользователем
- Модель (Model) - хранение и работа с данными
- Presenter - посредник между моделью и отображением

# Базовый код

**Абстрактный класс `Component<T>`**
Предоставляет общие методы для управления отображением и состоянием HTML-элементов. Используется как родительский класс для компонентов интерфейса.
- **`toggleClass(element, className, force?)`** – переключает CSS-класс у элемента.
    
- **`setText(element, value)`** – устанавливает текстовое содержимое.
    
- **`setDisabled(element, state)`** – блокирует/разблокирует элемент (`disabled`).
    
- **`setHidden(element)`** – скрывает элемент.
    
- **`setVisible(element)`** – показывает элемент.
    
- **`setImage(element, src, alt?)`** – задает `src` и `alt` для изображения.
    
- **`render(data?)`** – обновляет компонент данными и возвращает контейнер

**Абстрактный класс `Model<T>`**
предоставляет базовую функциональность для работы с моделями данных в приложении. 
- Хранит данные (состояние)
- Уведомляет подписчиков об изменениях через систему событий


Класс **Modal** наследует класс **Component**.
Отвечает за открытие и открытие модального окна

``` typescript
interface IModal {
	public open(content: HTMLElement): void; // открытие модального окна
	public close(): void; // закрытие модального окна
	private render(): void; //отрисовка контента
}
```



# Классы
## Слой отображения

Класс **Page** наследует **Component**.
Методы:
- `set counterBasket(value:number|null)` - счет количества товара в корзине.
- `set catalog(item:HTMLElement[])` - вывод каталог карточек на страницу
- `set locked(value: boolean)` - блокировка прокрутки при открытом модальном окне

Класс **Card** наследует класс **Component**.
Нужен для создания карточки товара.
``` typescript
interface IProductItem  {
	id:number;
    category: string;
    title: string;
    img: string;
    price: number| null;
    description?: string;
}
```

Класс  **CardModal** наследует класс **Component**

Отвечает за отображение карточки товара в модальном окне 
```ts
interface ICardModal {
	imageUrl: string;      // Ссылка на изображение товара
	category: string;      // Категория 
	title: string;         // Название товара 
	description: string;   // Описание 
	price: string;         // Цена 
}  
```

Класс **BasketModal** 
Отвечает за отображение корзины.  Наследует класс **Component**
``` typescript
export interface IBasket{
    id: number;
    title: string;
    price: number|null;
    count: number; 
    
	buttonLock (value: boolean) :boolean ;// смена состояний кнопки
	set price (value: number): string;// запись цены
	set content(items:HTMLElement[]) :void;//наполенение контентом
   
}
```

Класс **Form** наследуется из класса **Component**.
Отвечает за отображение формы 
```ts
interface IForm {
    _submit: HTMLButtonElement; //кнопка отправки формы
    _errors: HTMLElement; //вывод ошибок
    container: HTMLFormElement;
    events: IEvents; //брокер событий 
    set valid(value: boolean): void;
	set errors(value: string): void; //Устанавливает сообщение об ошибке
	set Placeholder(inputName: string, value: string): void; //Устанавливает плейсхолдер для указанного поля
  onInputChange(field: string, value: string): void; //Генерирует событие изменения значения поля
  clear(): void; //Очищает значения полей формы
  render(data: Partial<T> & IFormState): void; //Отрисовывает форму с переданными данными
}
```

Класс **OrderForm** наследуется наследует класс **Component**
Нужен для выбора оплаты и ввода адреса доставки в модальном окне.

```ts
interface IOrder {
    adress: string;
    payment: string;
}
```

Класс **ContactsForm**
Управляет формой ввода контактных данных в модальном окне. Наследует класс **Component**
``` typescript
interface IContacts {
    email: string;
    phone: string;
}
```

Класс **Success** 
Наследует класс **Component**
Управляет модальным окном успешного заказа с выводом общей стоимости.

```ts
interface ISuccess{
	button: HTMLElement;// кнопка закрытия 
	total: HTMLElement; //общая стоимость
	set total(total:number) 
}
```

## Слой модели данных
Класс **AppState**

Наследует базовые возможности от `ProductItem` и предоставляет методы для управления ключевыми процессами: корзиной, каталогом товаров и оформлением заказа.

``` typescript
export interface IAppState {
	catalog: IProductItem[]; //список товаров в каталоге
	basket: {
	    items: IBasketItem[]; //товары в корзине
	    total: number; // общая сумма
	};
	
    clearBasket(): void; //очищение корзины
    getTotal(): number; // общая сумма в заказе
    setCatalog(items: IProductItem[]): void; // список загузки товаров в каталог
    setOrderField(field: keyof IOrderForm, value: string): void; //Обновляет поле в данных заказа
    validateOrder(): boolean; //Проверяет корректность данных заказа
    setContactsField(field: keyof IContactsForm, value: string): void;//Обновляет поле в контактных данных
    validateContacts(): boolean; //Проверяет корректность контактных данных
    toggleBasketList(item: IProductItem): void; //Добавляет/удаляет товар в корзине
    getBasketList(): IProductItem[]; //Возвращает текущие товары в корзине
}
```

## Слой перезентера
Код описывающий взаимодействие отображения и данных между собой

``` typescript
// Взаимодействие с товарами
"catalog:changed"           // Обновление каталога
"card:select"               // Выбор карточки товара
"item:toggle"               // Добавление/удаление из корзины

// Работа с корзиной
"basket:changed"            // Изменение состава корзины
"basket:open"               // Открытие корзины
"basket:clear"              // Очистка после оплаты

// Оформление заказа
"order:open"                // Открытие формы заказа
"payment:change"            // Смена способа оплаты
"order:submit"              // Отправка данных доставки
"contacts:submit"           // Отправка контактов

// Модальные окна
"modal:open"                // Открытие модального окна
"modal:close"               // Закрытие модального окна

