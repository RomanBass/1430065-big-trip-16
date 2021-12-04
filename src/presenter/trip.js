import SortingView from '../view/sorting.js';
import NoPointView from '../view/no-point.js';
import EventsListView from '../view/events-list.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter from './point.js';
import { SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';
import { sortByDateFrom, sortByPrice, sortByDuration } from '../utils/route.js';
import { filter } from '../utils/filter.js';
import PointNewPresenter from './point-new.js';
import { BlankPoint } from '../utils/const.js';
import LoadingView from '../view/loading.js';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._sortingComponent = null;
    this._noPointComponent = null;
    this._eventsListComponent = new EventsListView();
    this._pointPresenters = {};
    this._currentSortType = SortType.BY_DATE_FROM;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._api = api;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new PointNewPresenter(
      this._eventsListComponent, this._handleViewAction,
    );
    this._loadingComponent = new LoadingView();
  }

  init() {
    if (this._isLoading) {
      this._renderLoading();
    } else {
      if (!this._getPoints().length) { // если точек нет, то отображается заглушка
        this._renderNoPoint();
      } else {
        this._renderSort();
        this._renderEventsList();
        this._renderPoints();
      }
    }

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.BY_DATE_FROM;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (!this._tripContainer.contains(this._eventsListComponent.element)) {
      this._renderEventsList();
    }

    this._pointNewPresenter.init(BlankPoint, this._pointsModel.getOffers(),
      this._pointsModel.getDestinations());

    remove(this._noPointComponent);
  }

  destroy() {
    this._clearPointsList();

    remove(this._sortingComponent);
    remove(this._eventsListComponent);
    remove(this._loadingComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearPointsList() { // удаляет все точки
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.BY_DATE_FROM:
        return filteredPoints.sort(sortByDateFrom);
      case SortType.BY_PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.BY_DURATION:
        return filteredPoints.sort(sortByDuration);
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) { //обрабатывает как отражается на модели действие на представлении
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenters[update.id].abortingFormSubmit();
          });
        break;
      case UserAction.ADD_POINT:
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.abortingPointAdding();
          });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenters[update.id].abortingPointDelete();
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) { // обрабатывает как отражается на представлении изменение в модели
    switch (updateType) { //обновление точки
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data, this._pointsModel.getOffers());
        break;
      case UpdateType.MINOR: //обновление списка точек
        this._clearPointsList();
        this._renderPoints();
        break;
      case UpdateType.MAJOR: //обновление списка точек + перерисовка элемента фильтров
        this._clearPointsList();
        remove(this._sortingComponent);
        remove(this._noPointComponent); // чтобы удалялаяь надпись отсутствия точек при фильтрации в случае массива из одной точки

        if (!this._getPoints().length) {
          this._renderNoPoint();
        } else {
          this._currentSortType = SortType.BY_DATE_FROM;
          this._renderSort();
          this._renderPoints();
        }

        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);

        if (!this._getPoints().length) {
          this._renderNoPoint();
        } else {
          this._currentSortType = SortType.BY_DATE_FROM;
          this._renderSort();
          this._renderEventsList();
          this._renderPoints();
        }

        break;
    }
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _renderNoPoint() {
    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (!this._getPoints().length) {
      this._noPointComponent = new NoPointView(this._filterType);
      render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
    }

  }

  _renderSort() {

    if (this._sortingComponent) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter =
    new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._pointsModel.getOffers(), this._pointsModel.getDestinations());
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().slice().forEach((point) => this._renderPoint(point));
  }

  _renderEventsList() {
    render(this._tripContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

}
