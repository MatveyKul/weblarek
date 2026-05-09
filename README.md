# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

Модели данных
#### ProductsCatalog
Назначение: управление каталогом товаров (хранение, поиск, выбор текущего товара).

Конструктор: constructor() – без параметров.

Поля:

products: IProduct[] – массив всех товаров каталога.

selectedProduct: IProduct | null – выбранный для просмотра товар (или null).

Методы:

setProducts(products: IProduct[]): void – заменяет каталог новым массивом.

getProducts(): IProduct[] – возвращает копию массива товаров.

getProductById(id: string): IProduct | undefined – находит товар по id.

setSelectedProduct(product: IProduct | null): void – устанавливает выбранный товар.

getSelectedProduct(): IProduct | null – возвращает выбранный товар.

#### Basket
Назначение: управление корзиной (добавление, удаление, подсчет суммы и количества).

Конструктор: constructor() – без параметров.

Поля:

items: IProduct[] – массив товаров в корзине.

Методы:

getItems(): IProduct[] – возвращает массив товаров.

addItem(product: IProduct): void – добавляет товар (если его ещё нет).

removeItem(productId: string): void – удаляет товар по id.

clearBasket(): void – очищает корзину.

getTotalPrice(): number – возвращает общую стоимость.

getItemCount(): number – возвращает количество товаров.

containsItem(productId: string): boolean – проверяет наличие товара.

#### Customer
Назначение: хранение и валидация данных покупателя (способ оплаты, адрес, телефон, email).

Конструктор: constructor() – без параметров.

Поля:

payment: TPayment | null – выбранный способ оплаты.

address: string – адрес доставки.

phone: string – номер телефона.

email: string – электронная почта.

Методы:

setData(data: Partial<IBuyer>): void – частично обновляет данные.

getData(): IBuyer – возвращает все данные.

clearData(): void – сбрасывает все поля.

validate(): TBuyerValidationErrors – проверяет заполненность полей, возвращает объект с ошибками.

### Коммуникационный слой
#### WebLarekAPI
Назначение: фасад для работы с сервером, предоставляет предметно-ориентированные методы, используя внедрённую зависимость, реализующую IApi.

Конструктор: constructor(api: IApi) – принимает объект, реализующий интерфейс IApi (базовый класс Api).

Поля:

api: IApi – экземпляр для выполнения HTTP-запросов.

Методы:

getProducts(): Promise<IProductResponse> – загружает список товаров.

postOrder(order: IOrder): Promise<IOrderResult> – отправляет заказ.

Интерфейсы и типы (src/types/index.ts)

type TPayment = 'online' | 'cash';
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

interface IProduct {
    id: string; description: string; image: string;
    title: string; category: string; price: number | null;
}

interface IBuyer {
    payment: TPayment | null;
    email: string; phone: string; address: string;
}

interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

interface IOrderResult {
    id: string;
    total: number;
}

interface IProductResponse {
    total: number;
    items: IProduct[];
}

### Слой представления (View)

Слой View отвечает за отображение интерфейса интернет-магазина «Web-Larёk» и обработку пользовательских действий.
Каждый класс представления отвечает только за свой участок DOM-разметки и не содержит бизнес-логики.
Взаимодействие с приложением осуществляется через события, которые генерируются компонентами и обрабатываются презентером.

Базовый класс представления
#### Класс Component<T>

Назначение: базовый класс для всех визуальных компонентов приложения.

Родительский класс для всех компонентов интерфейса.

Конструктор
constructor(container: HTMLElement)
Поля
container: HTMLElement

Корневой DOM-элемент компонента.

Методы
render(data?: Partial<T>): HTMLElement

Обновляет данные компонента и возвращает DOM-элемент.

setImage(element: HTMLImageElement, src: string, alt?: string): void

Устанавливает изображение и альтернативный текст.

Классы карточек товаров

Все классы карточек наследуются от общего родителя Card, так как имеют общий функционал отображения информации о товаре.

#### Класс Card

Назначение: базовый класс карточки товара.

Содержит общую логику отображения товара.

Наследуется от:

Component<IProduct>
Конструктор
constructor(container: HTMLElement, events: EventEmitter)
Поля
title: HTMLElement
price: HTMLElement
image?: HTMLImageElement
category?: HTMLElement
button?: HTMLButtonElement
events: EventEmitter
id: string
Методы
setData(product: IProduct): void

Заполняет карточку данными товара.

set title(value: string)

Устанавливает название товара.

set price(value: number | null)

Устанавливает цену товара.

set image(value: string)

Устанавливает изображение товара.

set category(value: string)

Устанавливает категорию товара.

#### Класс CatalogCard

Назначение: отображение карточки товара в каталоге.

Наследуется от:

Card
Особенности
отображается в сетке каталога;
при клике открывает подробную карточку товара.
События
card:select

Генерируется при клике на карточку.

#### Класс PreviewCard

Назначение: отображение подробной информации о товаре в модальном окне.

Наследуется от:

Card
Особенности
отображает описание товара;
содержит кнопку добавления товара в корзину.
Поля
description: HTMLElement
Методы
set description(value: string)

Устанавливает описание товара.

События
basket:add

Генерируется при добавлении товара в корзину.

#### Класс BasketCard

Назначение: отображение товара внутри корзины.

Наследуется от:

Card
Особенности
отображается списком;
содержит кнопку удаления товара.
Поля
index: HTMLElement

Порядковый номер товара в корзине.

Методы
setIndex(value: number): void

Устанавливает номер товара.

События
basket:remove

Генерируется при удалении товара из корзины.

Класс страницы
#### Класс Page

Назначение: управление основными элементами страницы.

Наследуется от:

Component<object>
Конструктор
constructor(container: HTMLElement, events: EventEmitter)
Поля
catalog: HTMLElement
basketCounter: HTMLElement
wrapper: HTMLElement
basketButton: HTMLButtonElement
Методы
set catalog(items: HTMLElement[])

Отображает каталог товаров.

set counter(value: number)

Обновляет счётчик корзины.

set locked(value: boolean)

Блокирует прокрутку страницы при открытии модального окна.

События
basket:open

Генерируется при открытии корзины.

Класс корзины
#### Класс BasketView

Назначение: отображение корзины товаров.

Наследуется от:

Component<object>
Конструктор
constructor(container: HTMLElement, events: EventEmitter)
Поля
list: HTMLElement
total: HTMLElement
button: HTMLButtonElement
Методы
set items(items: HTMLElement[])

Отображает список товаров корзины.

set total(value: number)

Отображает общую стоимость заказа.

toggleButton(state: boolean): void

Включает или отключает кнопку оформления заказа.

События
order:start

Генерируется при начале оформления заказа.

Классы форм

Обе формы наследуются от общего родителя Form, содержащего общую логику работы с формами.

#### Класс Form<T>

Назначение: базовый класс формы.

Наследуется от:

Component<T>
Конструктор
constructor(container: HTMLFormElement, events: EventEmitter)
Поля
submitButton: HTMLButtonElement
errors: HTMLElement
events: EventEmitter
Методы
set valid(value: boolean)

Изменяет состояние кнопки отправки формы.

set errors(value: string)

Отображает ошибки валидации.

getInputValues(): Record<string, string>

Возвращает значения полей формы.

События
form:change

Генерируется при изменении данных формы.

form:submit

Генерируется при отправке формы.

#### Класс OrderForm

Назначение: форма выбора способа оплаты и адреса доставки.

Наследуется от:

Form<IBuyer>
Поля
paymentButtons: HTMLButtonElement[]
addressInput: HTMLInputElement
Методы
set payment(value: TPayment)

Устанавливает выбранный способ оплаты.

set address(value: string)

Устанавливает адрес доставки.

События
order.payment:change

Изменение способа оплаты.

order.address:change

Изменение адреса доставки.

#### Класс ContactsForm

Назначение: форма контактных данных покупателя.

Наследуется от:

Form<IBuyer>
Поля
emailInput: HTMLInputElement
phoneInput: HTMLInputElement
Методы
set email(value: string)

Устанавливает email.

set phone(value: string)

Устанавливает номер телефона.

События
contacts.email:change

Изменение email.

contacts.phone:change

Изменение телефона.

Класс модального окна
#### Класс Modal

Назначение: управление модальным окном.

Класс не имеет дочерних классов и используется для отображения любых компонентов внутри модального контейнера.

Наследуется от:

Component<HTMLElement>
Конструктор
constructor(container: HTMLElement, events: EventEmitter)
Поля
content: HTMLElement
closeButton: HTMLButtonElement
Методы
open(): void

Открывает модальное окно.

close(): void

Закрывает модальное окно.

setContent(content: HTMLElement): void

Устанавливает содержимое модального окна.

События
modal:open

Открытие модального окна.

modal:close

Закрытие модального окна.

Класс успешного оформления заказа
#### Класс Success

Назначение: отображение сообщения об успешном оформлении заказа.

Наследуется от:

Component<IOrderResult>
Конструктор
constructor(container: HTMLElement, events: EventEmitter)
Поля
total: HTMLElement
button: HTMLButtonElement
Методы
set total(value: number)

Отображает итоговую сумму заказа.

События
success:close

Генерируется при закрытии окна успешного заказа.

### Презентер
Архитектурное решение
Презентер реализован непосредственно в main.ts (без отдельного класса) по следующим причинам:

Приложение имеет единственную страницу с несложной логикой

Такой подход обеспечивает лучшую читаемость и прозрачность потока данных

Код остаётся компактным и легко модифицируемым

Отсутствует риск избыточной абстракции

Инверсия зависимостей соблюдена: Презентер зависит от абстракций (интерфейсов событий и API), а не от конкретных реализаций.

Ответственности Презентера
Создание экземпляров всех моделей, представлений и API

Подписка на события от моделей и представлений

Обработка событий с вызовом соответствующих методов моделей и представлений

Синхронизация данных между моделями и представлениями

Управление модальными окнами (открытие/закрытие, смена контента)

Поток данных в приложении

Пользователь → Представление (событие) → Презентер → Модель (изменение данных)
                                                              ↓
Модель (событие изменения) → Презентер → Представление (рендер)