import './scss/styles.scss';

import { ProductsCatalog } from './components/models/ProductsCatalog';
import { Basket } from './components/models/Basket';
import { Customer } from './components/models/Customer';
import { WebLarekAPI } from './components/services/WebLarekAPI';
import { API_URL } from './utils/constants'; // CDN_URL удалён, так как не используется
import { apiProducts } from './utils/data';

// ==================== 1. Тестирование моделей на статических данных ====================
console.group('Тестирование моделей данных (статические данные)');

// --- Каталог ---
const productsModel = new ProductsCatalog();
productsModel.setProducts(apiProducts.items);
console.log('setProducts() - каталог сохранён');
console.log('getProducts():', productsModel.getProducts());

const firstProduct = productsModel.getProducts()[0];
if (firstProduct) {
    console.log(`getProductById("${firstProduct.id}"):`, productsModel.getProductById(firstProduct.id));
    productsModel.setSelectedProduct(firstProduct);
    console.log('getSelectedProduct():', productsModel.getSelectedProduct());
}

// --- Корзина ---
const basket = new Basket();
basket.addItem(firstProduct);
console.log('addItem(firstProduct) - корзина:', basket.getItems());
console.log('getItemCount():', basket.getItemCount());
console.log('getTotalPrice():', basket.getTotalPrice());

const secondProduct = productsModel.getProducts()[1];
if (secondProduct) {
    basket.addItem(secondProduct);
    console.log('addItem(secondProduct) - корзина:', basket.getItems());
    console.log('getTotalPrice():', basket.getTotalPrice());
}
console.log(`containsItem("${firstProduct.id}"):`, basket.containsItem(firstProduct.id));
basket.removeItem(firstProduct.id);
console.log(`removeItem("${firstProduct.id}") - корзина:`, basket.getItems());
basket.clearBasket();
console.log('clearBasket() - корзина:', basket.getItems());

// --- Покупатель ---
const customer = new Customer();
customer.setData({ email: 'test@example.com', phone: '+71234567890', address: 'ул. Пушкина, д.1', payment: 'online' });
console.log('setData() и getData():', customer.getData());
console.log('validate() (все поля валидны):', customer.validate());

const invalidCustomer = new Customer();
// payment не передаём, чтобы проверить ошибку "Не выбран способ оплаты"
invalidCustomer.setData({ email: '', phone: '123', address: '' });
console.log('validate() с ошибками:', invalidCustomer.validate());

customer.clearData();
console.log('clearData() - данные очищены:', customer.getData());

console.groupEnd();

// ==================== 2. Работа с сервером (коммуникационный слой) ====================
console.group('Запрос к серверу и сохранение в каталог');

const api = new WebLarekAPI(API_URL);

api.getProducts()
    .then(data => {
        console.log('Получены данные с сервера:', data);
        productsModel.setProducts(data.items);
        console.log('Массив товаров сохранён в каталог через setProducts()');
        console.log('Товары из модели (getProducts):', productsModel.getProducts());
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    })
    .finally(() => {
        console.groupEnd();
    });