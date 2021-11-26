import dayjs from 'dayjs';

export const ARRAY_INDEX_ZERO = 0;
export const ARRAY_INDEX_ONE = 1;
export const ARRAY_INDEX_TWO = 2;

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight',
  'check-in', 'sightseeing', 'restaurant'];

export const BlankPossibleOffers = {
  bus: [],
  'check-in': [],
  drive: [],
  flight: [],
  restaurant: [],
  ship: [],
  sightseeing: [],
  taxi: [],
  train: [],
};

export const AddFormData = { // данные для дефолтной точки
  BASE_PRICE: 100,
  TRIP_DURATION: 3,
  DESTINATION: {description: 'The nicest city of the world', name: 'New City', pictures: []},
  IS_FAVORITE: false,
  OFFERS: [],
  TYPE: 'taxi',
};

export const BlankPoint = { // дефолтная точка для формы добавления
  basePrice: AddFormData.BASE_PRICE,
  dateFrom: dayjs(),
  dateTo: dayjs().add(AddFormData.TRIP_DURATION, 'day'),
  destination: AddFormData.DESTINATION,
  isFavorite: AddFormData.IS_FAVORITE,
  offers: AddFormData.OFFERS,
  type: AddFormData.TYPE,
};

export const SortType = {
  BY_DATE_FROM: 'sort-day',
  BY_PRICE: 'sort-price',
  BY_DURATION: 'sort-time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const NoPointMessage = { //сообщения при отсутствии базовых или отфильтрованных точек
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

export const MenuItem = {
  TABLE: 'table',
  STATISTICS: 'stats',
};

export const blankPossibleDestinations = [{
  name: 'London',
  description: 'London is the capital of the UK',
  pictures: {src: '', description: ''},
}];
