import AbstractView from './abstract.js';
import { FilterType } from '../utils/const.js';

const createFiltersTemplate = (currentFilterType, filtersStatus) => (
  `<form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="everything"
    ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}
    ${filtersStatus.EVERYTHING === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="future"
    ${currentFilterType === FilterType.FUTURE ? 'checked' : ''}
    ${filtersStatus.FUTURE === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-future">Future</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter" value="past"
    ${currentFilterType === FilterType.PAST ? 'checked' : ''}
    ${filtersStatus.PAST === true ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-past">Past</label>
  </div>

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`
);

export default class Filter extends AbstractView {
  #currentFilterType = null;
  #filtersStatus = {};

  constructor(currentFilterType, filtersStatus) {
    super();

    this.#currentFilterType = currentFilterType;
    this.#filtersStatus = filtersStatus;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilterType, this.#filtersStatus);
  }

  #filterTypeChangeHandler = (evt) => {
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }
}
