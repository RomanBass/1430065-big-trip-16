import SmartView from './smart.js';

const createInfoAndPriceTemplate = (price, date, name) => (
  `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${name}</h1>
    <p class="trip-info__dates">${date}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>
</section>`
);

export default class InfoAndPrice extends SmartView {
  constructor(price, date, name) {
    super();

    this._data = {tripPrice: price, tripDate: date, tripName: name};
  }

  get template() {
    return createInfoAndPriceTemplate(this._data.tripPrice, this._data.tripDate, this._data.tripName);
  }

  restoreHandlers() {
  }
}
