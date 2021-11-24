import EditFormView from '../view/edit-form.js';
import { render, RenderPosition, remove } from '../utils/render';
import { UserAction, UpdateType } from '../utils/const.js';

export default class PointNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._editFormComponent = null;
    this._changeData = changeData;

    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleAddFormCancel = this._handleAddFormCancel.bind(this);
  }

  init(point, offers, destinations) {

    if (this._editFormComponent !== null) { // чтобы не отрисовывалось две формы добавления
      return;
    }

    this._editFormComponent = new EditFormView(point, offers, destinations);

    this._editFormComponent.setEditFormSubmitButtonClickHandler(this._handleEditFormSubmit);
    this._editFormComponent.setAddFormCancelHandler(this._handleAddFormCancel);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    render(this._eventListContainer, this._editFormComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    remove(this._editFormComponent);
    this._editFormComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleEditFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  _handleAddFormCancel() { // обработчик на кнопку Cancel для удаления формы добавления
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  abortingPointAdding() {
    this._editFormComponent.showSave();
    this._editFormComponent.showEnabled();
    this._editFormComponent.shake();
  }

}
