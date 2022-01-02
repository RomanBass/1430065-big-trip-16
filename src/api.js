import PointsModel from './model/points.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get points() {
    return this.#load({url: 'points'})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptPointsToClient));
  }

  get offers() {
    return this.#load({url: 'offers'})
      .then(Api.toJSON)
      .then((offers) => PointsModel.adaptOffersToClient(offers));
  }

  get destinations() {
    return this.#load({url: 'destinations'})
      .then(Api.toJSON)
      .then((destinations) => destinations);
  }

  updatePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptPointsToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptPointsToClient);
  }

  addPoint(point) {
    return this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptPointsToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptPointsToClient);
  }

  deletePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }


  #load = async ({url, method = Method.GET, body = null, headers = new Headers()}) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(`${this.#endPoint}/${url}`, {method, body, headers});

    try {
      Api.checkStatus(response);
    } catch (err) {
      Api.catchError(err);
    }

    return fetch(`${this.#endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus = (response) => {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON = (response) => response.json();

  static catchError = (err) => {
    throw err;
  }
}
