import SiteMenuView from './view/site-menu.js';
import InfoAndPriceView from './view/info-price.js';
import { getRouteDates, getRoutePrice, getRouteName } from './utils/route.js';
import {remove, render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MenuItem, UpdateType, BlankPossibleOffers, ARRAY_INDEX_ZERO, ARRAY_INDEX_ONE,
  ARRAY_INDEX_TWO} from './utils/const.js';
import StatisticsView from './view/statistics.js';
import { getMoneyByTypeData, getPointsNumberByTypeData, getDurationByTypeData}
  from  './utils/statistics.js';
import Api from './api/api.js';
import { getDestinationsFromPoints } from './utils/route.js';

const AUTHORIZATION = 'Basic df9df9df8sd8fg8u';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header'); // крупный блок
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation'); // контейнеры...
const tripElement = siteHeaderElement.querySelector('.trip-main');
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const bodyElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = document.querySelector('.trip-events');

const newPointAddButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');
//...кнопка добавления точки

const api = new Api(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();
const siteMenuComponent = new SiteMenuView();

render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND); // отрисовки компонентов...

const tripInfo = new InfoAndPriceView(
  getRoutePrice(pointsModel.getPoints()),
  getRouteDates(pointsModel.getPoints()),
  getRouteName(pointsModel.getPoints()));

render(tripElement, tripInfo, RenderPosition.AFTERBEGIN);
pointsModel.addObserver(() => {
  tripInfo.updateData(
    {
      tripPrice: getRoutePrice(pointsModel.getPoints(), pointsModel.getOffers()),
      tripDate: getRouteDates(pointsModel.getPoints()),
      tripName: getRouteName(pointsModel.getPoints()),
    },
  );
});

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuOptionName) => {

  switch (menuOptionName) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();

      statisticsComponent = new StatisticsView(
        getMoneyByTypeData(pointsModel.getPoints()),
        getPointsNumberByTypeData(pointsModel.getPoints()),
        getDurationByTypeData(pointsModel.getPoints()),
      );

      render(bodyElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }

};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripPresenter.init();
filterPresenter.init();

pointsModel.addObserver(() => {
  if (statisticsComponent) {
    statisticsComponent.updateData(
      {
        tripMoneyData: getMoneyByTypeData(pointsModel.getPoints()),
        tripTypeData: getPointsNumberByTypeData(pointsModel.getPoints()),
        tripDurationData: getDurationByTypeData(pointsModel.getPoints()),
      },
    );
  }
});

newPointAddButton.disabled = true; //отключает кнопку на время загрузки данных

newPointAddButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

Promise
  .allSettled([api.getOffers(), api.getDestinations(), api.getPoints()])
  .then((results) => {

    if (results[ARRAY_INDEX_ZERO].status === 'fulfilled') {
      pointsModel.setOffers(results[ARRAY_INDEX_ZERO].value);
    } else {
      pointsModel.setOffers(BlankPossibleOffers);
    }

    if (results[ARRAY_INDEX_ONE].status === 'fulfilled') {
      pointsModel.setDestinations(results[ARRAY_INDEX_ONE].value);
    } else if (results[ARRAY_INDEX_TWO].status === 'fulfilled') {
      pointsModel.setDestinations(getDestinationsFromPoints(results[ARRAY_INDEX_TWO].value));
    } else {
      pointsModel.setDestinations([]);
    } /* Если не загружены назначения, то они извлекаются из точек,
        если не загружены точки, то назначениям присваивается []  */

    if (results[ARRAY_INDEX_TWO].status === 'fulfilled') {
      pointsModel.setPoints(UpdateType.INIT, results[ARRAY_INDEX_TWO].value);
    } else {
      pointsModel.setPoints(UpdateType.INIT, []);
    }

    newPointAddButton.disabled = false; //включает кнопку после загрузки данных

  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

