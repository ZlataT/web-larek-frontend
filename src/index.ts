import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { Card } from './components/card';
import { LarekApi } from './components/LarekApi';
import './scss/styles.scss';
import { ICard, IProductListResponse } from './types';
import { CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

//все шаблоны 

// Инициализация системы событий
const events = new EventEmitter();

// Создаем модальное окно
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

const API_URL = 'https://larek-api.nomoreparties.co';

// Инициализация системы событий

// Инициализация API
const api = new LarekApi(CDN_URL, API_URL);


// Получаем список товаров
api.getProductList()
    .then((products) => {
        // Добавляем карточки на страницу
        const gallery = ensureElement<HTMLElement>('.gallery');
        const cards = products.map(createCard);
        gallery.replaceChildren(...cards);
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });

// Функция создания карточки
function createCard(product: ICard): HTMLElement {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const cardElement = template.content.cloneNode(true) as HTMLElement;
    const cardContainer = cardElement.firstElementChild as HTMLElement;
    
    const card = new Card('card', cardContainer, {
        onClick: () => {
            // При клике открываем модалку с этим товаром
            showProductModal(product);
        }
    });
    
    // Заполняем данными
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    
    return cardContainer;
}

// Функция показа модалки с товаром
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

// Добавляем карточки на страницу

