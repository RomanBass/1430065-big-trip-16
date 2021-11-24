import dayjs from 'dayjs';
import {ARRAY_INDEX_ZERO, ARRAY_INDEX_ONE} from './statistics.js';

const INITIAL_OPTIONS_TOTAL_PRICE = 0;
const ARRAY_INDEX_TWO = 2;
const ARRAY_LAST_INDEX_SHIFT = 1;
const POINTS_NUMBER_ONE = 1;
const POINTS_NUMBER_TWO = 2;
const POINTS_NUMBER_THREE = 3;

export const sortByDateFrom = (pointOne, pointTwo) =>
  dayjs(pointOne.dateFrom).diff(dayjs(pointTwo.dateFrom));

export const sortByPrice = (pointOne, pointTwo) => {

  if (pointTwo.basePrice === pointOne.basePrice) {
  // если у точек одинаковая цена, то они сортируются по дате-времени начала
    return dayjs(pointOne.dateFrom).diff(dayjs(pointTwo.dateFrom));
  }

  return pointTwo.basePrice - pointOne.basePrice;
};

export const sortByDuration = (pointOne, pointTwo) => {
  const firstPointTravelDuration = dayjs(pointOne.dateTo).diff(dayjs(pointOne.dateFrom));
  const secondPointTravelDuration = dayjs(pointTwo.dateTo).diff(dayjs(pointTwo.dateFrom));
  return secondPointTravelDuration - firstPointTravelDuration;
};

export const getRouteName = (points) => { // вернуть имя маршрута
  let routeName = 'Route Info';

  if (points.length) {
    const pointsByDateFrom = points.slice().sort(sortByDateFrom);
    routeName = `${pointsByDateFrom[ARRAY_INDEX_ZERO].destination.name} ...
    ${pointsByDateFrom[pointsByDateFrom.length - ARRAY_LAST_INDEX_SHIFT].destination.name}` ;

    if (pointsByDateFrom.length === POINTS_NUMBER_THREE) {
      routeName = `${pointsByDateFrom[ARRAY_INDEX_ZERO].destination.name} &mdash;
      ${pointsByDateFrom[ARRAY_INDEX_ONE].destination.name}  &mdash;
      ${pointsByDateFrom[ARRAY_INDEX_TWO].destination.name}`;

    } else if (pointsByDateFrom.length === POINTS_NUMBER_TWO) {
      routeName = `${pointsByDateFrom[ARRAY_INDEX_ZERO].destination.name} &mdash;
      ${pointsByDateFrom[ARRAY_INDEX_ONE].destination.name}`;

    } else if (pointsByDateFrom.length === POINTS_NUMBER_ONE) {
      routeName = `${pointsByDateFrom[ARRAY_INDEX_ZERO].destination.name}`;
    }

  }

  return routeName;
};

export const getRouteDates = (points) => { // вернуть время маршрута
  let routeDates = 'Dates Info';

  if (points.length) {
    const pointsByDateFrom = points.slice().sort(sortByDateFrom);
    routeDates = `${pointsByDateFrom[ARRAY_INDEX_ZERO].dateFrom.format('MMM DD')}
    &nbsp;&mdash;&nbsp
    ${pointsByDateFrom[pointsByDateFrom.length - ARRAY_LAST_INDEX_SHIFT].dateTo.format('MMM DD')}`;

    if (pointsByDateFrom[ARRAY_INDEX_ZERO].dateFrom.format('MMM') ===
        pointsByDateFrom[pointsByDateFrom.length - ARRAY_LAST_INDEX_SHIFT].dateTo.format('MMM')) {

      routeDates = `${pointsByDateFrom[ARRAY_INDEX_ZERO].dateFrom.format('MMM DD')}
      &nbsp;&mdash;&nbsp
      ${pointsByDateFrom[pointsByDateFrom.length - ARRAY_LAST_INDEX_SHIFT].dateTo.format('DD')}`;
    }

  }

  return routeDates;
};

export const getRoutePrice = (points, possibleOffers) => { // вернуть стоимость маршрута
  let routePrice = INITIAL_OPTIONS_TOTAL_PRICE;
  points.forEach((point) => {
    routePrice += point.basePrice; // добавление стоимости поездки

    if (possibleOffers[point.type].length) {
    //...в случае, если опции не будут загружены с сервера, то их стоимость из точек не добавляется
      point.offers.forEach((offer) => { // добавление стоимости выбранных опций
        routePrice += offer.price;
      });
    }
  });
  return routePrice;
};

export const getDestinationsFromPoints = (points) => {
  //...создаёт массив объектов пунктов назначения из массива точек маршрута
  const destinationsFromPoints = [];
  points.forEach((point) => {
    destinationsFromPoints.push(point.destination);
  });

  return destinationsFromPoints;
};
