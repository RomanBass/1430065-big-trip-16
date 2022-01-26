import EditFormView from '../view/edit-form.js';
import { render, RenderPosition, remove, identifyEscapeKey } from '../utils/render';
import { UserAction, UpdateType } from '../utils/const.js';

export default class PointNew {
  #eventListContainer = null;
  #editFormComponent = null;
  #changeData = null;

  constructor(eventListContainer, changeData, cb) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.cb = cb;
  }

  init = (point, offers, destinations) => {

    if (this.#editFormComponent !== null) { // чтобы не отрисовывалось две формы добавления
      return;
    }

    this.#editFormComponent = new EditFormView(point, offers, destinations);

    this.#editFormComponent.setEditFormSubmitButtonClickHandler(this.#handleEditFormSubmit);
    this.#editFormComponent.setAddFormCancelHandler(this.#handleAddFormCancel);

    render(this.#eventListContainer, this.#editFormComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    remove(this.#editFormComponent);
    this.#editFormComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.cb();
  }

  #handleAddFormCancel = () => { // обработчик на кнопку Cancel для удаления формы добавления
    this.destroy();
    this.cb();
  }

  #escKeyDownHandler = (evt) => {
    if (identifyEscapeKey(evt)) {
      this.destroy();
      this.cb();
    }
  }

  abortingPointAdding = () => {
    this.#editFormComponent.showSave();
    this.#editFormComponent.showEnabled();
    this.#editFormComponent.shake();
  }

}
