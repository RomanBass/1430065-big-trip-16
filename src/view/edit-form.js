import { BlankPoint, blankPossibleDestinations } from '../utils/const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const RADIX_10 = 10; // основание десятичной системы исчисления

const createDataListTemplate = (cityName) => `<option value="${cityName}"></option>`;
//...возвращает образец ДОМ элемента в datalist наименований городов

const createOptionTemplate = (offer, isChecked) => { //возвращает образец ДОМ элемента опции
  const {title, price} = offer;
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}" type="checkbox"
  name="event-offer-${title}" ${isChecked}>
  <label class="event__offer-label" for="event-offer-${title}">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;
};

const createPhotoTemplate = (picture) => `<img class="event__photo" src="${picture.src}"
alt="${picture.description}">`;  //возвращает образец ДОМ элемента фотографии

const createEditFormTemplate = (
  point = BlankPoint, possibleOffers, possibleDestinations = blankPossibleDestinations) => {
  const {destination, basePrice, type, dateFrom, dateTo, offers} = point;
  const {description, name, pictures} = destination;

  const getDatalistContentTemplate = (serverDestinations) => {
    let dataListContentTemplate = '';
    serverDestinations.forEach((serverDestination) => {
      dataListContentTemplate += createDataListTemplate(serverDestination.name);
    });
    return dataListContentTemplate;
  };

  let isOffer = ''; // переменная скрывает блок с опциями, если опции отсутствуют для этой точки
  if (!possibleOffers[type].length){
    isOffer = 'visually-hidden';
  }

  const getOptionsTemplate = (possibleOffersCollection) =>  {
    //...возвращает ДОМ элемент возможных опции для точки типа type
    let OptionsTemplate = '';
    possibleOffersCollection[type].forEach((option) => {

      let isChecked = ''; // флаг - чекнуто ли offer

      const checkedOffer = offers.find((offer) => option.title === offer.title);
      //...находит и присваивает offer, совпадающий по названию с опцией

      if (checkedOffer) {
        isChecked = 'checked';
        checkedOffer.price = option.price; // чтобы передать цену в опции BlankPoint
      }

      OptionsTemplate += createOptionTemplate(option, isChecked);
    });
    return OptionsTemplate;
  };

  const getPhotosTemplate = (photosCollection) => { //возвращает дом элемент с фотографиями
    let PhotoTemplate = '';
    photosCollection.forEach((picture) => {
      PhotoTemplate += createPhotoTemplate(picture);
    });
    return PhotoTemplate;
  };

  let isPicture = '';
  //...переменная скрывает блок фотографий со скролом, если фотографии отсутствуют в данных точки
  if (!pictures.length) {
    isPicture = 'visually-hidden';
  }

  let isDestinationInfo = '';
  //...переменная скрывает блок информации о пункте назначения,
  //...если для него отсутствует описание и фотографии
  if (!pictures.length && description === '') {
    isDestinationInfo = 'visually-hidden';
  }

  const isEditForm = {
    //...переменная для определения названия кнопки ресет и нужна ли стрелка закрытия формы
    ROLLUP_BUTTON_CLASS: 'event__rollup-btn',
    RESET_BUTTON_NAME: 'Delete',
    ADD_FORM_CLASS: '',
  };

  if (point.id === BlankPoint.id) {
    //...удаляет стрелку и переименовывает кнопку ресет, если это форма добавления
    isEditForm.ROLLUP_BUTTON_CLASS = 'visually-hidden';
    isEditForm.RESET_BUTTON_NAME = 'Cancel';
    isEditForm.ADD_FORM_CLASS = '';
  }

  return `<li class="trip-events__item ${isEditForm.ADD_FORM_CLASS}">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png"
          alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
        <datalist id="destination-list-1">${getDatalistContentTemplate(possibleDestinations)}</datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom.format('DD')}/${dateFrom.format('MM')}/${dateFrom.format('YY')} ${dateFrom.format('HH')}:${dateFrom.format('mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo.format('DD')}/${dateTo.format('MM')}/${dateTo.format('YY')} ${dateTo.format('HH')}:${dateTo.format('mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isEditForm.RESET_BUTTON_NAME}</button>
      <button class="${isEditForm.ROLLUP_BUTTON_CLASS}" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers ${isOffer}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">${getOptionsTemplate(possibleOffers)}</div>
      </section>
      <section class="event__section  event__section--destination ${isDestinationInfo}">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container  ${isPicture}">
          <div class="event__photos-tape">${getPhotosTemplate(pictures)}</div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditForm extends SmartView {
  #dateFromPicker = null;
  #dateToPicker = null;
  #possibleOffers = null;
  #possibleDestinations = null;

  constructor(point = BlankPoint, possibleOffers, possibleDestinations) {
    super();
    this._data = point; // this._point заменён на this._data чтобы отнаследоваться от SmartView
    this.#possibleOffers = possibleOffers;
    this.#possibleDestinations = possibleDestinations;

    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createEditFormTemplate(this._data,  this.#possibleOffers, this.#possibleDestinations);
  }

  #editFormRollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editFormRollupButtonClick();
  }

  setEditFormRollupButtonClickHandler = (callback) => {

    const editRollupButton = this.element.querySelector('.event__rollup-btn');
    if (editRollupButton !== null) {
      //...чтоб не выдавало ошибку addEventLister от null при отрисовке формы добавления
      this._callback.editFormRollupButtonClick = callback;
      editRollupButton.addEventListener('click', this.#editFormRollupButtonClickHandler);
    }
  }

  #editFormSubmitButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#showSaving();
    this.#showDisabled();
    this._callback.editFormSubmitButtonClick(this._data);
  }

  setEditFormSubmitButtonClickHandler = (callback) => {
    this._callback.editFormSubmitButtonClick = callback;
    this.element.querySelector('form')
      .addEventListener('submit', this.#editFormSubmitButtonClickHandler);
  }

  #showSaving = () => {
    this.element.querySelector('.event__save-btn').textContent = 'Saving...';
  }

  showSave() {
    this.element.querySelector('.event__save-btn').textContent = 'Save';
  }

  #deletePointClickHandler = (evt) => {
    evt.preventDefault();
    this.#showDeleting();
    this.#showDisabled();
    this._callback.deletePointClickHandler(this._data);
  }

  setDeletePointClickHandler(callback) {
    this._callback.deletePointClickHandler = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deletePointClickHandler);
  }

  #showDeleting = () => {
    this.element.querySelector('.event__reset-btn').textContent = 'Deleting...';
  }

  showDelete() {
    this.element.querySelector('.event__reset-btn').textContent = 'Delete';
  }

  #showDisabled = () => {
    this.element.querySelectorAll(
      'fieldset, input:not(.visually-hidden), button, .event__offer-checkbox')
      .forEach((element) => {
        element.disabled = true;
      });
  }

  showEnabled() {
    this.element.querySelectorAll(
      'fieldset, input:not(.visually-hidden), button, .event__offer-checkbox')
      .forEach((element) => {
        element.disabled = false;
      });
  }

  #addFormCancelHandler = (evt) => {
    //...добавляет обработчик на кнопку Cancel для удаления формы добавления
    evt.preventDefault();
    this._callback.addFormCancelHandler();
  }

  setAddFormCancelHandler(callback) {
    this._callback.addFormCancelHandler = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#addFormCancelHandler);
  }

  #typeFieldsetChangeHandler = (evt) => { //обработчик fieldset по изменению типа точки
    this.updateData({
      type: evt.target.value,
      offers:  this.#possibleOffers[evt.target.value],
    });
  }

  #destinationInputChangeHandler = (evt) => { //обработчик input ввода названия города

    const NewDestination =
    this.#possibleDestinations.find((destination) => destination.name === evt.target.value);
    //...находит в datalist введёный город и присваивает данной константе

    if (NewDestination) { // Если введёный город есть в datalist, то производит изменение.
      this.updateData({  // Иначе - выдаёт сообщение setCustomValidity
        destination: {
          description: NewDestination.description,
          name: NewDestination.name,
          pictures: NewDestination.pictures,
        },
      });
    } else {
      this.element.querySelector('.event__input--destination')
        .setCustomValidity('This city is not available, please select one from the popup list.');
      this.element.querySelector('.event__input--destination').reportValidity();
    }

  }

  #basePriceInputChangeHandler = (evt) => { //обработчик input ввода стоимости
    this.updateData({basePrice: parseInt(evt.target.value, RADIX_10)});
    //...обновляются данные точки в части стоимости
  }

  #offersChangeHandler = (evt) => { //обработчик выбора опций
    const clickedOptionTitle = evt.target.parentElement.querySelector('label span:first-child')
      .textContent; //достаёт из разметки наименование кликУемой опции

    const isClickedOption = this._data.offers.some((option) => option.title === clickedOptionTitle);
    //...флаг проверки наличия кликнутой опции в массиве опций данной точки

    if (isClickedOption) {
      this._data.offers = this._data.offers.filter((option) => option.title !== clickedOptionTitle);
      //...кликнутая опция удаляется
    } else {
      const clickedOptionPrice = evt.target.parentElement.querySelector('label span:last-child')
        .textContent; //достаёт из раметки цену кликуемой опции

      const ClickedOption = {title: clickedOptionTitle,
        price: parseInt(clickedOptionPrice, RADIX_10)}; //создаёт объект кликнутой опции

      this._data.offers.unshift(ClickedOption);
      //...добавляет объект кликнутой опции в массив опций данной точки
    }

    this.updateData({offers: this._data.offers}); //обновляются данные точки в части опций
  }

  restoreHandlers() { //восстанавливает все необходимые обработчики на новую форму редактирования
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
    this.setEditFormRollupButtonClickHandler(this._callback.editFormRollupButtonClick);
    this.setEditFormSubmitButtonClickHandler(this._callback.editFormSubmitButtonClick);
  }

  #setInnerHandlers = () => { //вешает "внутренние" обработчики на форму редактирования
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeFieldsetChangeHandler);
    //...вешает обработчик на fieldset выбора типа точки
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChangeHandler);
    //...вешает обработчик на input ввода названия города
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#basePriceInputChangeHandler);
    //..вешает обработчик на input ввода цены
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersChangeHandler);
    //..вешает обработчик на опции
  }

  #setDateFromPicker = () => { // устанавливает окно ввода даты старта
    if (this.#dateFromPicker) { // удаляет дом-мусор от ранее созданных окон flatpicker-а
      this.#dateFromPicker.destroy(); // команда flatpicker-а
      this.#dateFromPicker = null;
    }

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('.event__field-group--time input:nth-child(2)'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: `${this._data.dateTo.format('DD')}/${this._data.dateTo.format('MM')}/${this._data.dateTo.format('YY')} ${this._data.dateTo.format('HH')}:${this._data.dateTo.format('mm')}`,
        defaultDate: `${this._data.dateFrom.format('DD')}/${this._data.dateFrom.format('MM')}/${this._data.dateFrom.format('YY')} ${this._data.dateFrom.format('HH')}:${this._data.dateFrom.format('mm')}`,
        onClose: this.#dateFromChangeHandler, //колбэк на изменение выбранной даты
      },
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: dayjs(userDate),
    });
  }

  #setDateToPicker = () => { // устанавливает окно ввода даты окончания
    if (this.#dateToPicker) { // удаляет дом-мусор от ранее созданных окон flatpicker-а
      this.#dateToPicker.destroy(); // команда flatpicker-а
      this.#dateToPicker = null;
    }

    this.#dateToPicker = flatpickr(
      this.element.querySelector('.event__field-group--time input:nth-child(4)'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: `${this._data.dateFrom.format('DD')}/${this._data.dateFrom.format('MM')}/${this._data.dateFrom.format('YY')} ${this._data.dateFrom.format('HH')}:${this._data.dateFrom.format('mm')}`,
        defaultDate: `${this._data.dateTo.format('DD')}/${this._data.dateTo.format('MM')}/${this._data.dateTo.format('YY')} ${this._data.dateTo.format('HH')}:${this._data.dateTo.format('mm')}`,
        onClose: this.#dateToChangeHandler, //колбэк на изменение выбранной даты
      },
    );
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: dayjs(userDate),
    });
  }
}
