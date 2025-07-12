import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { Step1, Step2, Step3 } from './components/orderingWizard';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IProduct, ISuccess } from './types';
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
const wizardStep1 = new Step1(cloneTemplate(orderTemplate), events, appState.order);
const wizardStep2 = new Step2(cloneTemplate(contactsTemplate), events, appState.order);
const wizardStep3 = new Step3(cloneTemplate(successTemplate), events);

// ОБРАБОТКА СОБЫТИЙ
// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});
// Разблокируем прокрутку
events.on('modal:close', () => {
	page.locked = false;
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
events.on('basket:order', () => {
    // Рендерим первый шаг мастера заказа
    modal.content = wizardStep1.render(appState.orderFormState);
    modal.open();
});
// Переход от 1 ко 2 шагу заказа
events.on('wizard:toStep2', () => {
    // Рендерим второй шаг мастера заказа
    modal.content = wizardStep2.render(appState.orderFormState);
    modal.open();
})
// Отправка заказа
events.on('wizard:submit', () => {
    appState.order.total = appState.basket.total;
    appState.order.items = appState.basket.contents.map(item => item.id);
    api.placeOrder(appState.order)
        .then((value: ISuccess) => {
            // Рендерим третий шаг мастера заказа с учётом списанных средств
            modal.content = wizardStep3.render({
                total: value.total,
            });
            modal.open();
        })
        .catch((err) => {
            console.error('Ошибка при отправке заказа:', err);
        });
})
// Закрытие мастера заказа
events.on('wizard:close', () => {
    modal.close();
    // Заказ успешно отправлен - очищаем корзину и данные заказа
    appState.clearBasket();
    appState.clearOrder();
});

// ЗАПУСК ПРИЛОЖЕНИЯ
// Получаем список товаров
api.getProductList()
    .then((products) => {
        // Преобразуем ответ АПИ в карточки и результат вставляем в страничку
        page.catalog = products.map(product => {
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
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });