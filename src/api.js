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
      .then(Api.parseResponse);
    // .then((points) => points.map(PointsModel.adaptPointsToClient));
  }

  get offers() {
    return this.#load({url: 'offers'})
      .then(Api.parseResponse);
    // .then((offers) => PointsModel.adaptOffersToClient(offers));
  }

  get destinations() {
    return this.#load({url: 'destinations'})
      .then(Api.parseResponse);
    // .then((destinations) => destinations);
  }

  updatePoint = async (point) => {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptPointsToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await Api.parseResponse(response);

    return parsedResponse;
  }

  addPoint = async (point) => {
    const response = await this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptPointsToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await Api.parseResponse(response);

    return parsedResponse;
  }

  // addPoint(point) {
  //   return this.#load({
  //     url: 'points',
  //     method: Method.POST,
  //     body: JSON.stringify(PointsModel.adaptPointsToServer(point)),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   })
  //     .then(Api.parseResponse)
  //     .then(PointsModel.adaptPointsToClient);
  // }

  deletePoint = async (point) => {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }


  // deletePoint(point) {
  //   return this.#load({
  //     url: `points/${point.id}`,
  //     method: Method.DELETE,
  //   });
  // }


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

  #adaptPointsToServer = (point) => {
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

  static checkStatus = (response) => {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static parseResponse = (response) => response.json();

  static catchError = (err) => {
    throw err;
  }
}
