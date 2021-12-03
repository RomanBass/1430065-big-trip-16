import PointView from '../view/point';
import EditFormView from '../view/edit-form.js';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { BlankPoint } from '../utils/const';
import { UserAction, UpdateType } from '../utils/const.js';

const Mode = { // определяет режим отображения - точка или форма редактирования
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._pointComponent = null;
    this._editFormComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._handlePointToEditFormClick = this._handlePointToEditFormClick.bind(this);
    this._handleEditFormToPointClick = this._handleEditFormToPointClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleDeletePoint = this._handleDeletePoint.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditFormComponent = this._editFormComponent;

    this._pointComponent = new PointView(point, offers);
    this._editFormComponent = new EditFormView(point, offers, destinations);

    this._pointComponent.setPointRollupButtonClickHandler(this._handlePointToEditFormClick);
    this._editFormComponent.setEditFormRollupButtonClickHandler(this._handleEditFormToPointClick);
    this._editFormComponent.setEditFormSubmitButtonClickHandler(this._handleEditFormSubmit);
    this._editFormComponent.setDeletePointClickHandler(this._handleDeletePoint);
    this._pointComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    //this._editFormComponent.showSave();

    if (this._point.id === BlankPoint.id) { // чтобы не отрисовывалась точка по данным формы добавления
      return;
    }

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this._eventListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editFormComponent);
  }

  _replacePointToForm() {
    replace(this._editFormComponent, this._pointComponent.element);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handlePointToEditFormClick() { // клик по стрелке закрывает точку маршрута и открывает форму редактирования
    this._replacePointToForm();
  }

  _handleEditFormToPointClick() { // клик по стрелке закрывает форму редактирования и открывает точку маршрута
    this._replaceEditFormToPoint();
  }

  _handleFavoriteButtonClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {isFavorite: !this._point.isFavorite},
      ),
    );
  }

  _handleEditFormSubmit(point) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleDeletePoint(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  abortingFormSubmit() {
    this._editFormComponent.showSave();
    this._editFormComponent.showEnabled();
    this._editFormComponent.shake();
    this._pointComponent.shake();
  }

  abortingPointDelete() {
    this._editFormComponent.showDelete();
    this._editFormComponent.showEnabled();
    this._editFormComponent.shake();
  }
}
