import FilterView from '../view/filter.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { UpdateType } from '../utils/const.js';
import dayjs from 'dayjs';

export default class Filter {
  #filterContainer = null;
  #filtersModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor (filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    const AreFiltersAvailable = { // зависит от наличия точек при данном фильтре, используется для блокировки фильтров
      EVERYTHING: (this.#pointsModel.points).length > null,
      FUTURE: !!this.#pointsModel.points.find((point) => point.dateTo > dayjs()),
      PAST: !!this.#pointsModel.points.find((point) => point.dateFrom < dayjs()),
    };

    this.#filterComponent = new FilterView(this.#filtersModel.filter, AreFiltersAvailable);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {

    if (this.#filtersModel.filter === filterType) { // производит отбой, если клик происходит по текущему фильтру
      return;
    }

    this.#filtersModel.filter = [UpdateType.MINOR, filterType];  // производит изменение модели фильтров
  }
}
