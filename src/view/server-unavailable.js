import AbstractView from './abstract.js';

const createServerAnavailableTemplate = () => (
  '<p class="trip-events__msg" style="color: #ff0000; margin-top: 50px; margin-bottom: 50px;">Remote server is not available!</p>'
);

export default class serverUnavailable extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createServerAnavailableTemplate();
  }
}
