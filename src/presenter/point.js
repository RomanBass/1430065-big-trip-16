import PointView from '../view/point';
import EditFormView from '../view/edit-form.js';
import { render, RenderPosition, replace, remove, isEscEvent } from '../utils/render';
import { BlankPoint } from '../utils/const';
import { UserAction, UpdateType } from '../utils/const.js';

const Mode = { // определяет режим отображения - точка или форма редактирования
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  #eventListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;
  #changeData = null;
  #changeMode = null;
  #mode = null;
  #point = null;

  constructor(eventListContainer, changeData, changeMode) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#mode = Mode.DEFAULT;
  }

//init = (point, offers, destinations) => {
  init = (point, offers) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    this.#pointComponent = new PointView(point, offers);

 // this.#pointComponent.setPointRollupButtonClickHandler(() => this.#replacePointToForm(point, offers, destinations));
    this.#pointComponent.setPointRollupButtonClickHandler(this.#handlePointToEditFormClick);

    this.#pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);

    if (this.#point.id === BlankPoint.id) { // чтобы не отрисовывалась точка по данным формы добавления
      return;
    }

    if (prevPointComponent === null) {
      render(this.#eventListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  #replacePointToForm = (point, offers, destinations) => {

    this.#editFormComponent = new EditFormView(point, offers, destinations);
    this.#editFormComponent.setEditFormRollupButtonClickHandler(this.#handleEditFormToPointClick);
    this.#editFormComponent.setEditFormSubmitButtonClickHandler(this.#handleEditFormSubmit);
    this.#editFormComponent.setDeletePointClickHandler(this.#handleDeletePoint);

    replace(this.#editFormComponent, this.#pointComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    remove(this.#editFormComponent);
    this.#editFormComponent = null;
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editFormComponent.reset(this.#point); //...производит сброс изменённых данных на начальные при выходе из формы без сохранения
      this.#replaceEditFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point); //...производит сброс изменённых данных на начальные при выходе из формы без сохранения
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #handlePointToEditFormClick = () => { // клик по стрелке закрывает точку маршрута и открывает форму редактирования
    this.#replacePointToForm();
  }

  #handleEditFormToPointClick = () => { // клик по стрелке закрывает форму редактирования и открывает точку маршрута
    this.#replaceEditFormToPoint();
  }

  #handleFavoriteButtonClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this.#point,
        {isFavorite: !this.#point.isFavorite},
      ),
    );
  }

  #handleEditFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleDeletePoint = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  abortingFormSubmit = () => {
    this.#editFormComponent.showSave();
    this.#editFormComponent.showEnabled();
    this.#editFormComponent.shake();
    this.#pointComponent.shake();
  }

  abortingPointDelete = () => {
    this.#editFormComponent.showDelete();
    this.#editFormComponent.showEnabled();
    this.#editFormComponent.shake();
  }
}
