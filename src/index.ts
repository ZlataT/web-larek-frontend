import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { Basket } from './components/Basket';
import { Card } from './components/card';
import { LarekApi } from './components/LarekApi';
import { Contacts, Order, Success } from './components/orderingWizard';
import { Page } from './components/page';
import './scss/styles.scss';
import { FormUpdate, IOrder, IProduct, IProductResponse, ISuccess, ValidationResult } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// ФУНДАМЕНТАЛЬНЫЕ ЧАСТИ ПРИЛОЖЕНИЯ
// Инициализация системы событий
const events = new EventEmitter();
// Инициализация API
const api = new LarekApi(CDN_URL, API_URL);
// Создаём хранилище данных приложения
const appState = new AppState(events);

// ОТОБРАЖЕНИЕ
// Находим все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// Создаём страничку
const pageContainer = ensureElement<HTMLBodyElement>('.page');
const page = new Page(pageContainer, events);
// Создаём модальное окно
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);
// Создаём неизменные (статичные) компоненты странички - корзину и три шага мастера заказа
const basket = new Basket(cloneTemplate(basketTemplate), events);
const wizardOrder = new Order(cloneTemplate(orderTemplate), events);
const wizardContacts = new Contacts(cloneTemplate(contactsTemplate), events);
const wizardSuccess = new Success(cloneTemplate(successTemplate), events);

// ОБРАБОТКА СОБЫТИЙ
// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});
// Разблокируем прокрутку
events.on('modal:close', () => {
	page.locked = false;
});
events.on('products:changed', () => {
     // Преобразуем ответ АПИ в карточки и результат вставляем в страничку
    page.catalog = appState.products.map(product => {
        // Coздаём карточку по шаблону и ставим событие product:preview на клик
        const card = new Card(
            cloneTemplate(cardCatalogTemplate),
            () => events.emit('product:preview', product)
        );
        // Рендерим карточку
        return card.render({
            image: product.image,
            category: product.category,
            title: product.title,
            price: product.price,
        });
    });
    // Рендерим страницу
    page.render();
});
// Открытие превью продукта
events.on('product:preview', (product: IProduct) => {
    // Coздаём карточку по шаблону и добавляем в корзину при клике
    const card = new Card(
        cloneTemplate(cardPreviewTemplate),
        () => {
            appState.addToBasket(product);
            card.disableButton();
        },
    );

    if (appState.basket.contents.includes(product)){
        card.disableButton();
    }
    // Рендерим карточку и результат вставляем в модалку
    modal.content = card.render({
        image: product.image,
        category: product.category,
        title: product.title,
        price: product.price,
        description: product.description,
    });
    modal.open();
});
// Открытие корзины - собираем корзину и открываем модалку
events.on('basket:open', () => {
    buildBasket();
    // Рендерим корзину и результат вставляем в модалку
    modal.content = basket.render();
    modal.open();
});
// Содержимое корзины изменилось - пересобираем корзину
events.on('basket:changed', () => buildBasket());
// Вспомогательная функция - собираем корзину, но пока не открываем модалку
function buildBasket() {
    // Преобразуем продукты в карточки и результат вставляем в корзину
    basket.productCards = appState.basket.contents.map((product, index) => {
        // Coздаём карточку по шаблону и удаляем из корзины при клике
        const card = new Card(
            cloneTemplate(cardBasketTemplate),
            () => appState.removeFromBasket(product),
        );
        card.basketIndex = index + 1;
        // Рендерим карточку
        return card.render({
            title: product.title,
            price: product.price,
        });
    });
    // Устанавливаем сумму и количество позиций в корзине и на странице
    basket.total = appState.basket.total;
    page.counter = appState.basket.contents.length;
}
// Переход от корзины к мастеру заказа
events.on('basket:submit', () => {
    // Рендерим первый шаг мастера заказа
    modal.content = wizardOrder.render({});
    modal.open();
});
// Переход от 1 ко 2 шагу заказа
events.on('order:submit', () => {
    // Рендерим второй шаг мастера заказа
    modal.content = wizardContacts.render({});
    modal.open();
})
// Отправка заказа
events.on('contacts:submit', () => {
    const requestData: IOrder = {
        ...appState.order,
        total: appState.basket.total,
        items: appState.basket.contents.map(item => item.id),
    };
    api.placeOrder(requestData)
        .then((value: ISuccess) => {
            events.emit('api:placedOrder', value);
        })
        .catch((err) => {
            console.error('Ошибка при отправке заказа:', err);
        });
});
// Закрытие мастера заказа
events.on('success:submit', () => {
    modal.close();
});

events.on('api:placedOrder', (responseData: ISuccess) => {
    // Рендерим третий шаг мастера заказа с учётом списанных средств
    modal.content = wizardSuccess.render({
        total: responseData.total,
    });
    modal.open();
    // Заказ успешно отправлен - очищаем корзину и данные заказа
    appState.clearBasket();
    appState.clearOrder();
});

// Помещаем данные заказа в модель
events.on('order:input', (data: FormUpdate) => {
    appState.updateOrder(data.field, data.value);
});
// Помещаем данные заказа в модель
events.on('contacts:input', (data: FormUpdate) => {
    appState.updateContacts(data.field, data.value);
});

events.on('order:changed', (data: ValidationResult) => {
    wizardOrder.errors = data.errors;
    wizardOrder.valid = data.valid;
});
events.on('contacts:changed', (data: ValidationResult) => {
    wizardContacts.errors = data.errors;
    wizardContacts.valid = data.valid;
});

// ЗАПУСК ПРИЛОЖЕНИЯ
// Получаем список товаров
api.getProductList()
    .then((response: IProductResponse) => {
        appState.updateProducts(response.products);
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });