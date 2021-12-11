import FilterView from '../view/filter.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { UpdateType } from '../utils/const.js';
import dayjs from 'dayjs';

export default class Filter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor (filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    const AreFiltersAvailable = { // зависит от наличия точек при данном фильтре, используется для блокировки фильтров
      EVERYTHING: (this.#pointsModel.getPoints()).length > null,
      FUTURE: !!this.#pointsModel.getPoints().find((point) => point.dateTo > dayjs()),
      PAST: !!this.#pointsModel.getPoints().find((point) => point.dateFrom < dayjs()),
    };

    this.#filterComponent = new FilterView(this.#filterModel.getFilter(), AreFiltersAvailable);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {

    if (this.#filterModel.getFilter() === filterType) { // производит отбой, если клик происходит по текущему фильтру
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);  // производит изменение модели фильтров
  }
}
