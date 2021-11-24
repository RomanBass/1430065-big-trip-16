import AbstractView from './abstract.js';

const createEventsList = () => '<ul class="trip-events__list"></ul>';

export default class EventsList extends AbstractView {
  getTemplate() {
    return createEventsList();
  }
}
