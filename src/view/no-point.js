import AbstractView from './abstract.js';
import { NoPointMessage } from '../utils/const.js';

const createNoPointTemplate = (filterType) => (
  `<p class="trip-events__msg" style="color: #078ff0;">${NoPointMessage[filterType]}</p>`
);

export default class NoPoint extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createNoPointTemplate(this.#message);
  }
}
