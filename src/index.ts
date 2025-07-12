import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { Basket } from './components/basket';
import { Card } from './components/card';
import { CardCreator } from './components/cardPreiwe';
import { LarekApi } from './components/LarekApi';
 // Импортируем наш класс
import './scss/styles.scss';
import { ICard, IProductListResponse } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

//все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const modalBasket = ensureElement<HTMLTemplateElement>('#basket');
// Инициализация системы событий
const events = new EventEmitter();

// Создаем модальное окно
const modal = new Modal(modalContainer, events);

//экземпляр корзины


// Инициализация API
const api = new LarekApi(CDN_URL, API_URL);

// Создаем экземпляр CardCreator
const cardCreator = new CardCreator(
    cardCatalogTemplate,
    (product) => showProductModal(product) // Передаем обработчик открытия модалки
);

// Функция показа модалки с товаром (оставляем как есть)
function showProductModal(product: ICard) {
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.cloneNode(true) as HTMLElement;
    const previewContainer = previewElement.firstElementChild as HTMLElement;
    
    const previewCard = new Card('card', previewContainer);
    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.description = product.description;
    previewCard.image = product.image;
    
    modal.content = previewContainer;
    modal.open();
}

// Получаем список товаров
api.getProductList()
    .then((products) => {
        // Используем CardCreator для создания карточек
        const gallery = ensureElement<HTMLElement>('.gallery');
        const cards = cardCreator.createCards(products); // Используем метод класса
        gallery.replaceChildren(...cards);
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });