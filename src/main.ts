import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Customer } from './components/models/Customer';
import { WebLarekAPI } from './components/services/WebLarekAPI';
import { Header } from './components/views/Header';
import { Modal } from './components/views/common/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { Gallery } from './components/views/Gallery';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, TPayment, ICardData, IFormData, ISuccessData } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

const events = new EventEmitter();

// Модели
const api = new WebLarekAPI(new Api(API_URL));
const catalog = new ProductsCatalog(events);
const basket = new Basket(events);
const customer = new Customer(events);

// Состояние презентера (шаг оформления заказа)
type OrderStep = 'order' | 'contacts' | null;
let currentStep: OrderStep = null;

// Корневые элементы
const body = document.body;
const pageContainer = ensureElement('.page__wrapper', body);
const modalContainer = ensureElement('#modal-container', body);
const galleryContainer = ensureElement('.gallery', body);

// Представления
const header = new Header(pageContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order') as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts') as HTMLFormElement, events);
const successView = new Success(cloneTemplate('#success'), events);

// Шаблоны
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
if (!catalogCardTemplate || !previewCardTemplate || !basketCardTemplate) {
    throw new Error('Не найдены шаблоны карточек');
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function getImageUrl(image: string): string {
    return CDN_URL + image.replace(/\.svg$/i, '.png');
}

function renderCatalog(): void {
    const products = catalog.getProducts();
    const cards = products.map(product => {
        const container = cloneTemplate(catalogCardTemplate);
        const card = new CardCatalog(container, events, product.id);
        
        const cardData: ICardData = {
            title: product.title,
            price: product.price,
            category: product.category,
            image: getImageUrl(product.image)
        };
        card.render(cardData);
        return container;
    });
    gallery.items = cards;
}

function renderBasket(): void {
    const items = basket.getItems();
    const cards = items.map((item, idx) => {
        const container = cloneTemplate(basketCardTemplate);
        const card = new BasketCard(container, events, item.id);
        
        const cardData: ICardData = {
            id: item.id,
            title: item.title,
            price: item.price,
            index: idx + 1
        };
        card.render(cardData);
        return container;
    });
    basketView.items = cards;
    basketView.total = basket.getTotalPrice();
}

function renderPreview(): void {
    const selected = catalog.getSelectedProduct();
    if (!selected) return;

    const container = cloneTemplate(previewCardTemplate);
    const preview = new CardPreview(container, events, selected.id);
    
    // Определяем состояние кнопки на основе данных модели
    const isInBasket = basket.containsItem(selected.id);
    const isAvailable = selected.price !== null && selected.price > 0;
    
    const cardData: ICardData = {
        title: selected.title,
        category: selected.category,
        price: selected.price,
        description: selected.description,
        image: getImageUrl(selected.image),
        buttonLabel: isInBasket ? 'Уже в корзине' : (isAvailable ? 'В корзину' : 'Недоступно'),
        buttonDisabled: !isAvailable
    };
    preview.render(cardData);

    modal.content = container;
    modal.visible = true;
}

function renderCurrentForm(): void {
    const data = customer.getData();
    const errors = customer.validate();
    const errorsList = Object.values(errors);
    
    if (currentStep === 'order') {
        const formData: IFormData = {
            payment: data.payment,
            address: data.address,
            valid: !!(data.payment && data.address),
            errors: errorsList
        };
        orderForm.render(formData);
    } else if (currentStep === 'contacts') {
        const formData: IFormData = {
            email: data.email,
            phone: data.phone,
            valid: !!(data.email && data.phone),
            errors: errorsList
        };
        contactsForm.render(formData);
    }
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ====================

events.on('catalog:changed', () => renderCatalog());
events.on('catalog:selectedChanged', () => renderPreview());
events.on('basket:changed', () => {
    header.counter = basket.getItemCount();
    renderBasket();
    if (catalog.getSelectedProduct()) renderPreview();
});
events.on('customer:changed', () => {
    renderCurrentForm();
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ ====================

events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

events.on('preview:addToBasket', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product && product.price !== null && product.price > 0) basket.addItem(product);
    modal.visible = false;
});

events.on('basket:removeItem', ({ id }: { id: string }) => {
    basket.removeItem(id);
});

events.on('basket:open', () => {
    modal.content = basketView.element;
    modal.visible = true;
});

events.on('basket:order', () => {
    currentStep = 'order';
    modal.content = orderForm.element;
    // Модель уже имеет данные, вызов customer:changed обновит форму
    events.emit('customer:changed');
});

events.on('order:submit', () => {
    const data = customer.getData();
    if (data.payment && data.address) {
        currentStep = 'contacts';
        modal.content = contactsForm.element;
        events.emit('customer:changed');
    }
});

events.on('contacts:submit', async () => {
    const customerData = customer.getData();
    
    // Обрабатываем null явно
    if (!customerData.payment) {
        console.error('Способ оплаты не выбран');
        return;
    }
    
    const orderData: IOrder = {
        payment: customerData.payment,
        address: customerData.address,
        email: customerData.email,
        phone: customerData.phone,
        items: basket.getItems().map(i => i.id),
        total: basket.getTotalPrice(),
    };
    
    try {
        const result = await api.postOrder(orderData);
        const successData: ISuccessData = { total: result.total };
        successView.render(successData);
        modal.content = successView.element;
        basket.clearBasket();
        customer.clearData();
        currentStep = null;
    } catch (err) {
        console.error(err);
    }
});

events.on('order:paymentSelected', ({ payment }: { payment: TPayment }) => {
    customer.setData({ payment });
});

events.on('order:addressChanged', ({ address }: { address: string }) => {
    customer.setData({ address });
});

events.on('contacts:emailChanged', ({ email }: { email: string }) => {
    customer.setData({ email });
});

events.on('contacts:phoneChanged', ({ phone }: { phone: string }) => {
    customer.setData({ phone });
});

events.on('modal:closed', () => {
    currentStep = null;
    catalog.setSelectedProduct(null);
});

events.on('success:close', () => {
    modal.visible = false;
});

// ==================== СТАРТ ====================
api.getProducts()
    .then(data => catalog.setProducts(data.items))
    .catch(err => console.error(err));