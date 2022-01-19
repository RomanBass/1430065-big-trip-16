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
import ServerAnavailable from '../view/server-unavailable.js';

export default class Trip {
  #pointsModel = null;
  #filtersModel = null;
  #tripContainer = null;
  #sortingComponent = null;
  #noPointComponent = null;
  #eventsListComponent = new EventsListView();
  #pointPresenters = {};
  #currentSortType = SortType.BY_DATE_FROM;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #loadingComponent = new LoadingView();
  #pointNewPresenter = null;
  #serverUnavailableComponent = new ServerAnavailable();

  constructor(tripContainer, pointsModel, filterModel) {
    this.#pointsModel = pointsModel;
    this.#filtersModel = filterModel;
    this.#tripContainer = tripContainer;

    this.#pointNewPresenter = new PointNewPresenter(
      this.#eventsListComponent, this.#handleViewAction,
    );

  }

  init = () => {
    if (this.#isLoading) {
      this.#renderLoading();
    } else {
      if (!this.points.length) { // если точек нет, то отображается заглушка
        this.#renderNoPoint();
      } else {
        this.#currentSortType = SortType.BY_DATE_FROM;
        this.#renderSort();
        this.#renderEventsList();
        this.#renderPoints();
      }
    }

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  createPoint = () => {
    this.#currentSortType = SortType.BY_DATE_FROM;
    this.#filtersModel.filter = [UpdateType.MAJOR, FilterType.EVERYTHING];

    if (!this.#tripContainer.contains(this.#eventsListComponent.element)) {
      this.#renderEventsList();
    }

    this.#pointNewPresenter.init(BlankPoint, this.#pointsModel.offers,
      this.#pointsModel.destinations);

    remove(this.#noPointComponent);
  }

  destroy = () => {
    this.#clearPointsList();

    remove(this.#sortingComponent);
    remove(this.#eventsListComponent);
    remove(this.#loadingComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);
  }

  #clearPointsList = () => { // удаляет все точки
    this.#pointNewPresenter.destroy();
    Object
      .values(this.#pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this.#pointPresenters = {};
  }

  get points () {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.BY_PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.BY_DURATION:
        return filteredPoints.sort(sortByDuration);
    }

    return filteredPoints.sort(sortByDateFrom);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    Object
      .values(this.#pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => { //обрабатывает как отражается на модели действие на представлении
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters[update.id].abortingFormSubmit();
        }
        break;
      case UserAction.ADD_POINT:
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch {
          this.#pointNewPresenter.abortingPointAdding();
        }
        break;
      case UserAction.DELETE_POINT:
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters[update.id].abortingPointDelete();
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => { // обрабатывает как отражается на представлении изменение в модели
    switch (updateType) { //обновление точки
      case UpdateType.PATCH:
        this.#pointPresenters[data.id].init(data, this.#pointsModel.offers);
        break;
      case UpdateType.MINOR: //обновление списка точек
        this.#clearPointsList();
        remove(this.#noPointComponent); //удаление сообщения об отсутствии точек
        this.#renderPoints();
        break;
      case UpdateType.MAJOR: //обновление списка точек + перерисовка элемента фильтров
        this.#clearPointsList();
        remove(this.#sortingComponent);
        remove(this.#noPointComponent); // чтобы удалялаяь надпись отсутствия точек при фильтрации в случае массива из одной точки

        if (!this.points.length) {
          this.#renderNoPoint();
        } else {
          this.#currentSortType = SortType.BY_DATE_FROM;
          this.#renderSort();
          this.#renderPoints();
        }

        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        if (!this.points.length) { //если в модели массив точек пустой, то...

          if (!this.#pointsModel.downloadOkFlag) { //если данные о точках не пришли с сервера вообще, то выдаётся сообщение,...
            this.#renderServerUnavailable();//...что сервер не доступен
          } else {//если данные пришли с сервера корректно, но они пустые, то...
            this.#renderNoPoint(); //...рендерится сообщение - кликнуть NEW для создания новой точки
          }

        } else {
          this.#currentSortType = SortType.BY_DATE_FROM;
          this.#renderSort();
          this.#renderEventsList();
          this.#renderPoints();
        }

        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPoints();
  }

  #renderNoPoint = () => {
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (!this.points.length) {
      this.#noPointComponent = new NoPointView(this.#filterType);
      render(this.#tripContainer, this.#noPointComponent, RenderPosition.BEFOREEND);
    }

  }

  #renderServerUnavailable = () => {//отрисовка сообщения, что сервер недоступен
    render(this.#tripContainer, this.#serverUnavailableComponent, RenderPosition.BEFOREEND);
  }

  #renderSort = () => {

    if (this.#sortingComponent) {
      this.#sortingComponent = null;
    }

    this.#sortingComponent = new SortingView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripContainer, this.#sortingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter =
    new PointPresenter(this.#eventsListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenters[point.id] = pointPresenter;
  }

  #renderPoints = () => {
    this.points.slice().forEach((point) => this.#renderPoint(point));
  }

  #renderEventsList = () => {
    render(this.#tripContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

}
