import PointsModel from '../model/points.js';
import { isOnline } from '../utils/common.js';

const getSyncedPoints = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  // getPoints() {
  //   return this._load({url: 'points'})
  //     .then(Api.toJSON)
  //     .then((points) => points.map(PointsModel.adaptPointsToClient));
  // }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptPointsToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptPointsToClient));
  }

  // getOffers() {
  //   return this._load({url: 'offers'})
  //     .then(Api.toJSON)
  //     .then((offers) => PointsModel.adaptOffersToClient(offers));
  // }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers);
          this._store.setItems(items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems());

    return Promise.resolve(storeOffers);
  }

  // getDestinations() {
  //   return this._load({url: 'destinations'})
  //     .then(Api.toJSON)
  //     .then((destinations) => destinations);
  // }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations);
          this._store.setItems(items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems());

    return Promise.resolve(storeDestinations);
  }

  // updatePoint(point) {
  //   return this._load({
  //     url: `points/${point.id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(PointsModel.adaptPointsToServer(point)),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   })
  //     .then(Api.toJSON)
  //     .then(PointsModel.adaptPointsToClient);
  // }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptPointsToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptPointsToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  // addPoint(point) {
  //   return this._load({
  //     url: 'points',
  //     method: Method.POST,
  //     body: JSON.stringify(PointsModel.adaptPointsToServer(point)),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   })
  //     .then(Api.toJSON)
  //     .then(PointsModel.adaptPointsToClient);
  // }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptPointsToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  // deletePoint(point) {
  //   return this._load({
  //     url: `points/${point.id}`,
  //     method: Method.DELETE,
  //   });
  // }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  // sync(data) {
  //   return this._load({
  //     url: 'points/sync',
  //     method: Method.POST,
  //     body: JSON.stringify(data),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   })
  //     .then(Api.toJSON);
  // }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

}
