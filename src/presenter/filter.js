import FilterView from '../view/filter.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { FilterType, UpdateType } from '../utils/const.js';
import dayjs from 'dayjs';

export default class Filter {
  constructor (filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._currentFilterType = FilterType.EVERYTHING;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    const AreFiltersAvailable = { // зависит от наличия точек при данном фильтре, используется для блокировки фильтров
      EVERYTHING: (this._pointsModel.getPoints()).length > null,
      FUTURE: !!this._pointsModel.getPoints().find((point) => point.dateTo > dayjs()),
      PAST: !!this._pointsModel.getPoints().find((point) => point.dateFrom < dayjs()),
    };

    this._filterComponent = new FilterView(this._filterModel.getFilter(), AreFiltersAvailable);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {

    if (this._filterModel.getFilter() === filterType) { // производит отбой, если клик происходит по текущему фильтру
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);  // производит изменение модели фильтров
    this._currentFilterType = filterType;
  }
}
