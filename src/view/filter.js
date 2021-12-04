import AbstractView from './abstract.js';
import { FilterType } from '../utils/const.js';

const createFiltersTemplate = (currentFilterType, AreFiltersAvailable) => (
  `<form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="everything"
    ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}
    ${AreFiltersAvailable.EVERYTHING === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="future"
    ${currentFilterType === FilterType.FUTURE ? 'checked' : ''}
    ${AreFiltersAvailable.FUTURE === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-future">Future</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="past"
    ${currentFilterType === FilterType.PAST ? 'checked' : ''}
    ${AreFiltersAvailable.PAST === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-past">Past</label>
  </div>

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`
);

export default class Filter extends AbstractView {
  constructor(currentFilterType, AreFiltersAvailable) {
    super();

    this._currentFilterType = currentFilterType;
    this._AreFiltersAvalable = AreFiltersAvailable;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  get template() {
    return createFiltersTemplate(this._currentFilterType, this._AreFiltersAvalable);
  }

  _filterTypeChangeHandler(evt) {
    this.#callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this.#callback.filterTypeChange = callback;
    this.element.addEventListener('change', this._filterTypeChangeHandler);
  }
}
