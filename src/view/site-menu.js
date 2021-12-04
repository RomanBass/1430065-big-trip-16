import AbstractView from './abstract.js';
import { MenuItem } from '../utils/const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-option-name="${MenuItem.TABLE}">Table</a>
  <a class="trip-tabs__btn" href="#"" data-option-name="${MenuItem.STATISTICS}">Stats</a>
</nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  get template() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.optionName);

    if (!evt.target.classList.contains('trip-tabs__btn--active')) {
      const prevActiveMenuOption = this.element.querySelector('.trip-tabs__btn--active');

      evt.target.classList.add('trip-tabs__btn--active');
      prevActiveMenuOption.classList.remove('trip-tabs__btn--active');

    }

  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this._menuClickHandler);
  }

}
