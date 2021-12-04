import AbstractView from './abstract.js';
import { NoPointMessage } from '../utils/const.js';

const createNoPointTemplate = (filterType) => (
  `<p class="trip-events__msg" style="color: #078ff0;">${NoPointMessage[filterType]}</p>`
);

export default class NoPoint extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  get template() {
    return createNoPointTemplate(this._message);
  }
}
