import AbstractView from './abstract.js';

const createServerAnavailableTemplate = () => (
  '<p class="trip-events__msg" style="color: #078ff0;">Remote Server Unavailable</p>'
);

export default class serverUnavailable extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createServerAnavailableTemplate();
  }
}
