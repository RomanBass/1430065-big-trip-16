import Observer from '../utils/observer.js';
import { FilterType } from '../utils/const.js';

export default class Filter extends Observer {
  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  set filter([updateType, filter]) {
    this.#activeFilter = filter;
    this._notify(updateType, filter);
  }
}
