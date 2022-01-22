import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import { getRouteDates, getRoutePrice, getRouteName } from './utils/route.js';
import {remove, render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { MenuItem } from './utils/const.js';
import StatisticsView from './view/statistics.js';
import { getMoneyByTypeData, getPointsNumberByTypeData, getDurationByTypeData}
  from  './utils/statistics.js';
import ApiService from './api.js';

const AUTHORIZATION = 'Basic df9df9df8sd8fg8s';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header'); // крупный блок
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation'); // контейнеры...
const tripElement = siteHeaderElement.querySelector('.trip-main');
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const bodyElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = document.querySelector('.trip-events');

const newPointAddButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');
//...кнопка добавления точки

const filterModel = new FilterModel();
const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const siteMenuComponent = new SiteMenuView();

const tripInfo = new TripInfoView(
  getRoutePrice(pointsModel.points),
  getRouteDates(pointsModel.points),
  getRouteName(pointsModel.points));

render(tripElement, tripInfo, RenderPosition.AFTERBEGIN);
pointsModel.addObserver(() => {
  tripInfo.updateData(
    {
      tripPrice: getRoutePrice(pointsModel.points, pointsModel.offers),
      tripDate: getRouteDates(pointsModel.points),
      tripName: getRouteName(pointsModel.points),
    },
  );
});

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuOptionName) => {

  switch (menuOptionName) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      filterPresenter.destroy();

      statisticsComponent = new StatisticsView(
        getMoneyByTypeData(pointsModel.points),
        getPointsNumberByTypeData(pointsModel.points),
        getDurationByTypeData(pointsModel.points),
      );

      render(bodyElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }

};

tripPresenter.init();
filterPresenter.init();

pointsModel.addObserver(() => {
  if (statisticsComponent) {
    statisticsComponent.updateData(
      {
        tripMoneyData: getMoneyByTypeData(pointsModel.points),
        tripTypeData: getPointsNumberByTypeData(pointsModel.points),
        tripDurationData: getDurationByTypeData(pointsModel.points),
      },
    );
  }
});

newPointAddButton.disabled = true; //блокировка кнопки добавления точки на время загрузки данных

newPointAddButton.addEventListener('click', (evt) => { //нажатие кнопки добавления точки
  evt.preventDefault();
  remove(statisticsComponent);
  tripPresenter.destroy();
  tripPresenter.init();
  remove(siteMenuComponent); // удаление меню
  render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND); // отрисовка меню
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick); // установка обработчиков
  tripPresenter.createPoint();
});

pointsModel.init().finally(() => {
  render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND); // отрисовка меню Table Stats
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  newPointAddButton.disabled = false; //включает кнопку добавления точек после загрузки данных
});
