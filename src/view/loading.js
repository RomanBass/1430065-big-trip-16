import AbstractView from './abstract';

const createNoTaskTemplate = () => (
  '<p class="trip-events__msg" style="color: #078ff0">Loading...</p>'
);

export default class Loading extends AbstractView {
  get template() {
    return createNoTaskTemplate();
  }
}
