import Observer from '../utils/observer.js';
import dayjs from 'dayjs';

export default class Points extends Observer {
  #points = [];
  #offers = {};
  #destinations = [];

  set points([updateType, points]) {
    this.#points = [...points];
    this._notify(updateType);
  }

  get points() {
    return this.#points;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  get offers() {
    return this.#offers;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptPointsToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basePrice: point['base_price'],
        dateFrom: dayjs(point['date_from']),
        dateTo: dayjs(point['date_to']),
        isFavorite: point['is_favorite'],
      },
    );

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  static adaptPointsToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basePrice,
        'date_from': point.dateFrom.toISOString(),
        'date_to': point.dateTo.toISOString(),
        'is_favorite': point.isFavorite,
      },
    );

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static adaptOffersToClient(serverOffers) {
    const adaptedOffers = {};
    serverOffers.forEach((serverOffer) => {
      adaptedOffers[serverOffer.type] = serverOffer.offers;
    });

    return adaptedOffers;
  }
}
