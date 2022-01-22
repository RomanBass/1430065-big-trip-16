import dayjs from 'dayjs';

export const ARRAY_INDEX_ZERO = 0;
export const ARRAY_INDEX_ONE = 1;
export const ARRAY_INDEX_TWO = 2;

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight',
  'check-in', 'sightseeing', 'restaurant'];

export const BLANK_POSSIBLE_OFFERS = {
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

const ADD_FORM_DATA = { // данные для дефолтной точки
  BASE_PRICE: 100,
  TRIP_DURATION: 3,
  DESTINATION: {description: 'The nicest city of the world', name: 'New City', pictures: []},
  IS_FAVORITE: false,
  OFFERS: [],
  TYPE: 'taxi',
};

export const BlankPoint = { // дефолтная точка для формы добавления
  basePrice: ADD_FORM_DATA.BASE_PRICE,
  dateFrom: dayjs(),
  dateTo: dayjs().add(ADD_FORM_DATA.TRIP_DURATION, 'day'),
  destination: ADD_FORM_DATA.DESTINATION,
  isFavorite: ADD_FORM_DATA.IS_FAVORITE,
  offers: ADD_FORM_DATA.OFFERS,
  type: ADD_FORM_DATA.TYPE,
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

export const TripType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  'CHECK-IN': 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};
