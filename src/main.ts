// В самом начале main.ts, после импортов
console.log('=== ДИАГНОСТИКА ===');
console.log('VITE_API_ORIGIN:', import.meta.env.VITE_API_ORIGIN);
console.log('API_URL:', API_URL);
console.log('CDN_URL:', CDN_URL);
console.log('==================');

import './scss/styles.scss';

// Базовые классы
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

// Модели данных - проверьте точные имена файлов!
import { ProductsCatalog } from './components/models/ProductCatalog'; // Файл: ProductCatalog.ts
import { Basket } from './components/models/Basket'; // Файл: Basket.ts
import { Customer } from './components/models/Customer'; // Файл: Customer.ts

// Сервисы
import { WebLarekAPI } from './components/services/WebLarekAPI';

// Представления
import { Page } from './components/views/Page';
import { Modal } from './components/views/common/Modal';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm, IOrderData } from './components/views/OrderForm';
import { ContactsForm, IContactsData } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

// Утилиты и типы
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder, TPayment } from './types';  
import { cloneTemplate } from './utils/utils';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

// Брокер событий
const events = new EventEmitter();

// API и модели
const api = new WebLarekAPI(new Api(API_URL));
const catalog = new ProductsCatalog(events);
const basket = new Basket(events);
const customer = new Customer(events);

// Корневые элементы
const pageContainer = document.querySelector('.page__wrapper') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;

// Представления
const page = new Page(pageContainer, events);
const modal = new Modal(modalContainer, events);

// Шаблоны
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Проверка наличия шаблонов
if (!catalogCardTemplate) console.error('Template #card-catalog not found');
if (!previewCardTemplate) console.error('Template #card-preview not found');
if (!basketCardTemplate) console.error('Template #card-basket not found');
if (!basketTemplate) console.error('Template #basket not found');
if (!orderTemplate) console.error('Template #order not found');
if (!contactsTemplate) console.error('Template #contacts not found');
if (!successTemplate) console.error('Template #success not found');

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Получение полного URL изображения
 */
function getImageUrl(image: string): string {
    return CDN_URL + image;
}

/**
 * Обновление всех компонентов, зависящих от корзины
 */
function updateBasketDependentComponents(): void {
    // Обновляем счётчик на странице
    page.render({ counter: basket.getItemCount() });
    
    // Если модальное окно корзины открыто - обновляем его содержимое
    const basketContent = document.querySelector('.basket');
    if (basketContent && modalContainer.classList.contains('modal_active')) {
        renderBasketModal();
    }
}

/**
 * Рендер модального окна корзины
 */
function renderBasketModal(): void {
    if (!basketTemplate) return;
    
    const basketContainer = cloneTemplate(basketTemplate);
    const basketView = new BasketView(basketContainer, events);
    
    // Создаём карточки для каждого товара
    const items = basket.getItems();
    const cardElements: HTMLElement[] = [];
    
    items.forEach((item, index) => {
        if (!basketCardTemplate) return;
        const cardContainer = cloneTemplate(basketCardTemplate);
        const basketCard = new BasketCard(cardContainer, events, item.id, index + 1);
        basketCard.render(item);
        cardElements.push(cardContainer);
    });
    
    // Рендерим корзину
    basketView.render({
        items: cardElements,
        total: basket.getTotalPrice()
    });
    
    modal.setContent(basketContainer);
}

/**
 * Рендер первого экрана формы заказа (способ оплаты и адрес)
 */
function renderOrderForm(): void {
    if (!orderTemplate) return;
    
    const orderContainer = cloneTemplate(orderTemplate);
    const orderForm = new OrderForm(orderContainer, events);
    orderForm.reset();
    modal.setContent(orderContainer);
}

/**
 * Рендер второго экрана формы заказа (контакты)
 */
function renderContactsForm(): void {
    if (!contactsTemplate) return;
    
    const contactsContainer = cloneTemplate(contactsTemplate);
    const contactsForm = new ContactsForm(contactsContainer, events);
    contactsForm.reset();
    modal.setContent(contactsContainer);
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ====================

// 1. Изменение каталога товаров
events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    const cardElements: HTMLElement[] = [];
    
    products.forEach(product => {
        if (!catalogCardTemplate) return;
        const cardContainer = cloneTemplate(catalogCardTemplate);
        const card = new CatalogCard(cardContainer, events, product.id);
        
        // Преобразуем изображение в полный URL
        const productWithImage = {
            ...product,
            image: getImageUrl(product.image)
        };
        card.render(productWithImage);
        cardElements.push(cardContainer);
    });
    
    page.render({ items: cardElements });
});

// 2. Изменение выбранного товара
events.on('catalog:selectedChanged', ({ selected }: { selected: IProduct | null }) => {
    if (selected && previewCardTemplate) {
        const previewContainer = cloneTemplate(previewCardTemplate);
        const previewCard = new PreviewCard(previewContainer, events, selected.id);
        
        // Проверяем, есть ли товар в корзине
        const isInBasket = basket.containsItem(selected.id);
        previewCard.setInBasket(isInBasket);
        
        // Рендерим с полным URL изображения
        previewCard.render({
            ...selected,
            image: getImageUrl(selected.image)
        });
        
        modal.setContent(previewContainer);
        modal.open();
    }
});

// 3. Изменение корзины
events.on('basket:changed', () => {
    updateBasketDependentComponents();
});

// 4. Изменение данных покупателя
events.on('customer:changed', () => {
    console.log('Данные покупателя обновлены:', customer.getData());
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ ====================

// 1. Выбор карточки для просмотра
events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) {
        catalog.setSelectedProduct(product);
    }
});

// 2. Нажатие кнопки покупки товара
events.on('preview:addToBasket', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product && product.price !== null && product.price > 0) {
        basket.addItem(product);
    }
});

// 3. Нажатие кнопки удаления товара из корзины
events.on('basket:removeItem', ({ id }: { id: string }) => {
    basket.removeItem(id);
});

// 4. Нажатие кнопки открытия корзины
events.on('basket:open', () => {
    renderBasketModal();
    modal.open();
});

// 5. Нажатие кнопки оформления заказа (из корзины)
events.on('basket:order', () => {
    renderOrderForm();
});

// 6. Нажатие кнопки перехода ко второй форме оформления заказа
events.on('order:submit', (data: IOrderData) => {
    // Сохраняем данные заказа в модель покупателя
    customer.setData({
        payment: data.payment as TPayment,
        address: data.address
    });
    
    // Переходим к форме контактов
    renderContactsForm();
});

// 7. Нажатие кнопки оплаты/завершения оформления заказа
events.on('contacts:submit', async (data: IContactsData) => {
    // Сохраняем контактные данные
    customer.setData({
        email: data.email,
        phone: data.phone
    });
    
    // Проверяем валидность всех данных
    const errors = customer.validate();
    if (Object.keys(errors).length > 0) {
        console.error('Ошибки валидации:', errors);
        return;
    }
    
    // Формируем заказ для отправки
    const orderData: IOrder = {
        payment: customer.getData().payment as TPayment,
        address: customer.getData().address,
        email: customer.getData().email,
        phone: customer.getData().phone,
        items: basket.getItems().map(item => item.id),
        total: basket.getTotalPrice()
    };
    
    try {
        // Отправляем заказ на сервер
        const result = await api.postOrder(orderData);
        
        // Показываем экран успеха
        if (successTemplate) {
            const successContainer = cloneTemplate(successTemplate);
            const successView = new Success(successContainer, events);
            successView.render({ total: result.total });
            modal.setContent(successContainer);
        }
        
        // Очищаем корзину и данные покупателя
        basket.clearBasket();
        customer.clearData();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// 8. Изменение данных в формах (валидация)
events.on('order:change', ({ isValid }: { isValid: boolean }) => {
    console.log('Форма заказа валидна:', isValid);
});

events.on('contacts:change', ({ isValid }: { isValid: boolean }) => {
    console.log('Форма контактов валидна:', isValid);
});

// 9. Закрытие модального окна
events.on('modal:closed', () => {
    // Очищаем выбранный товар
    catalog.setSelectedProduct(null);
});

// 10. Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
});

// ==================== ЗАГРУЗКА НАЧАЛЬНЫХ ДАННЫХ ====================

// Загружаем товары с сервера
api.getProducts()
    .then(data => {
        console.log('Товары загружены:', data.items.length);
        catalog.setProducts(data.items);
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    });