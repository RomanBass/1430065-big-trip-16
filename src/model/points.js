import Observer from './observer.js';
import dayjs from 'dayjs';
import { UpdateType, BlankPossibleOffers } from '../utils/const.js';
import { getDestinationsFromPoints } from '../utils/route.js';

export default class Points extends Observer {
  #points = [];
  #offers = {};
  #destinations = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptPointsToClient);
    } catch(err) {
      this.#points = [];
    }

    try {
      const offers = await this.#apiService.offers;
      this.#offers = this.#adaptOffersToClient(offers);
    } catch(err){
      this.#offers = BlankPossibleOffers;
    }

    try {
      const destinations = await this.#apiService.destinations;
      this.#destinations = destinations;
    } catch {
      this.#destinations = getDestinationsFromPoints(this.points);
    }

    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptPointsToClient(response);


      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);

    } catch(err) {
      throw new Error('Can\'t update task');
    }

  }

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptPointsToClient(response);

      this.#points = [newPoint, ...this.#points];

      this._notify(updateType, newPoint);

    } catch(err) {
      throw new Error('Can\'t update task');
    }

  }

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    await this.#apiService.deletePoint(update);
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);

  }

  #adaptPointsToClient = (point) => {
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

  #adaptOffersToClient = (serverOffers) => {
    const adaptedOffers = {};
    serverOffers.forEach((serverOffer) => {
      adaptedOffers[serverOffer.type] = serverOffer.offers;
    });

    return adaptedOffers;
  }
}
