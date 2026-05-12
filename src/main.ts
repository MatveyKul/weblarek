import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Customer } from './components/models/Customer';
import { WebLarekAPI } from './components/services/WebLarekAPI';
import { Page } from './components/views/Page';
import { Modal } from './components/views/common/Modal';
import { CatalogCard } from './components/views/CardCatalog'; // проверьте экспорт
import { CardPreview } from './components/views/CardPreview';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { Gallery } from './components/views/Gallery';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, TPayment } from './types'; // IProduct удалён, т.к. не используется
import { cloneTemplate, ensureElement } from './utils/utils';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

const events = new EventEmitter();

// Модели
const api = new WebLarekAPI(new Api(API_URL));
const catalog = new ProductsCatalog(events);
const basket = new Basket(events);
const customer = new Customer(events);

// Корневые элементы (используем body как контекст)
const body = document.body;
const pageContainer = ensureElement('.page__wrapper', body);
const modalContainer = ensureElement('#modal-container', body);
const galleryContainer = ensureElement('.gallery', body);

// Представления (статические)
const page = new Page(pageContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order') as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts') as HTMLFormElement, events);
const successView = new Success(cloneTemplate('#success'), events);

// Шаблоны для динамических карточек (прямой querySelector, так как document не HTMLElement)
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
        const card = new CatalogCard(container, events, product.id);
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = getImageUrl(product.image);
        return container;
    });
    gallery.items = cards;
}

function renderBasket(): void {
    const items = basket.getItems();
    const cards = items.map((item, idx) => {
        const container = cloneTemplate(basketCardTemplate);
        const card = new BasketCard(container, events, item.id);
        card.title = item.title;
        card.price = item.price;
        card.index = idx + 1;
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
    preview.title = selected.title;
    preview.category = selected.category;
    preview.price = selected.price;
    preview.description = selected.description;
    preview.image = getImageUrl(selected.image);

    let state: 'available' | 'inBasket' | 'unavailable';
    if (selected.price === null || selected.price <= 0) state = 'unavailable';
    else if (basket.containsItem(selected.id)) state = 'inBasket';
    else state = 'available';
    preview.buttonState = state;

    modal.content = container;
    modal.open();
}

function updateOrderForm(): void {
    const data = customer.getData();
    orderForm.setSelectedPayment(data.payment);
    orderForm.setAddress(data.address);
    const isValid = !!data.payment && !!data.address;
    orderForm.setNextButtonEnabled(isValid);
    const error = !data.address ? 'Введите адрес доставки' : null;
    orderForm.setAddressError(error);
}

function updateContactsForm(): void {
    const data = customer.getData();
    contactsForm.setEmail(data.email);
    contactsForm.setPhone(data.phone);
    const errors: string[] = [];
    if (!data.email) errors.push('Укажите email');
    if (!data.phone) errors.push('Укажите телефон');
    contactsForm.setValidationErrors(errors);
    contactsForm.setPayButtonEnabled(errors.length === 0);
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ====================

events.on('catalog:changed', () => renderCatalog());
events.on('catalog:selectedChanged', () => renderPreview());
events.on('basket:changed', () => {
    page.counter = basket.getItemCount();
    renderBasket();
    if (catalog.getSelectedProduct()) renderPreview();
});
events.on('customer:changed', () => {
    const current = modal.currentContent;
    if (current?.classList?.contains('order')) updateOrderForm();
    if (current?.classList?.contains('form') && current.querySelector('[name="email"]')) updateContactsForm();
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ ====================

events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

events.on('preview:addToBasket', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product && product.price !== null && product.price > 0) basket.addItem(product);
    modal.close();
});

events.on('preview:removeFromBasket', ({ id }: { id: string }) => {
    basket.removeItem(id);
    modal.close();
});
events.on('basket:removeItem', ({ id }: { id: string }) => {
    basket.removeItem(id);
});
events.on('basket:open', () => {
    modal.content = basketView.element;
    modal.open();
});
events.on('basket:order', () => {
    modal.content = orderForm.element;
    updateOrderForm();
});
events.on('order:submit', () => {
    const data = customer.getData();
    if (data.payment && data.address) {
        modal.content = contactsForm.element;
        updateContactsForm();
    }
});
events.on('contacts:submit', async () => {
    const orderData: IOrder = {
        payment: customer.getData().payment as TPayment,
        address: customer.getData().address,
        email: customer.getData().email,
        phone: customer.getData().phone,
        items: basket.getItems().map(i => i.id),
        total: basket.getTotalPrice(),
    };
    try {
        const result = await api.postOrder(orderData);
        successView.total = result.total;
        modal.content = successView.element;
        basket.clearBasket();
        customer.clearData();
    } catch (err) {
        console.error(err);
    }
});
events.on('order:paymentSelected', ({ payment }: { payment: TPayment }) => {
    customer.setData({ payment });
    updateOrderForm();
});
events.on('order:addressChanged', ({ address }: { address: string }) => customer.setData({ address }));
events.on('contacts:emailChanged', ({ email }: { email: string }) => customer.setData({ email }));
events.on('contacts:phoneChanged', ({ phone }: { phone: string }) => customer.setData({ phone }));
events.on('modal:closed', () => catalog.setSelectedProduct(null));
events.on('success:close', () => modal.close());

// ==================== СТАРТ ====================
api.getProducts()
    .then(data => catalog.setProducts(data.items))
    .catch(err => console.error(err));