import { TYPES } from './const.js';

export const ARRAY_INDEX_ZERO = 0;
export const ARRAY_INDEX_ONE = 1;
const INITIAL_TYPE_PRICE = 0;
const INITIAL_TYPE_NUMBER = 0;
const INITIAL_TYPE_DURATION = 0;

const getPointsByType = (points) => { // трансформирует массив точек в объект массивов точек выбранных по типу
  const PointsByType = {};
  let allPoints = points.slice();
  let filteredPoints;
  let remainingPoints;

  TYPES.forEach((type) => {
    filteredPoints = allPoints.filter((point) => point.type === type);

    if (!filteredPoints.length) {
      return PointsByType;
    }

    remainingPoints = allPoints.filter((point) => point.type !== type);
    allPoints = remainingPoints;

    if (filteredPoints.length) {
      PointsByType[type] = filteredPoints;
    }

  });

  return PointsByType;
};

export const getMoneyByTypeData = (points) => { // возвращает объект типа {..., тип: полная стоимость,...}

  const moneyByTypeDataArray = [];
  const moneyByTypeDataObject = {};
  const PointsByType = getPointsByType(points);
  const currentTypes = Object.keys(PointsByType);

  let currentTypePrice = INITIAL_TYPE_PRICE;

  currentTypes.forEach((type) => {
    PointsByType[type].forEach((point) => {
      currentTypePrice += point.basePrice;
    });
    moneyByTypeDataArray.push([type.toUpperCase(), currentTypePrice]);
    currentTypePrice = INITIAL_TYPE_PRICE;
  });

  moneyByTypeDataArray.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  moneyByTypeDataArray.forEach((moneyByTypeInstance) => {
    moneyByTypeDataObject[moneyByTypeInstance[ARRAY_INDEX_ZERO]] =
    moneyByTypeInstance[ARRAY_INDEX_ONE];
  });

  return moneyByTypeDataObject;
};

export const getPointsNumberByTypeData = (points) => { // возвращает объект типа {..., тип: количество точек,...}

  const numberByTypeDataArray = [];
  const numberByTypeDataObject = {};
  const PointsByType = getPointsByType(points);
  const currentTypes = Object.keys(PointsByType);

  let currentTypeNumber = INITIAL_TYPE_NUMBER;

  currentTypes.forEach((type) => {
    currentTypeNumber = PointsByType[type].length;
    numberByTypeDataArray.push([type.toUpperCase(), currentTypeNumber]);
    currentTypeNumber = INITIAL_TYPE_NUMBER;
  });

  numberByTypeDataArray.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  numberByTypeDataArray.forEach((numberByTypeInstance) => {
    numberByTypeDataObject[numberByTypeInstance[ARRAY_INDEX_ZERO]] =
    numberByTypeInstance[ARRAY_INDEX_ONE];
  });

  return numberByTypeDataObject;
};

export const getDurationByTypeData = (points) => { // возвращает объект типа {..., тип: полная стоимость,...}

  const durationByTypeDataArray = [];
  const durationByTypeDataObject = {};
  const PointsByType = getPointsByType(points);
  const currentTypes = Object.keys(PointsByType);

  let currentTypeDuration = INITIAL_TYPE_DURATION;

  currentTypes.forEach((type) => {
    PointsByType[type].forEach((point) => {
      currentTypeDuration += point.dateTo - point.dateFrom;
    });
    durationByTypeDataArray.push([type.toUpperCase(), currentTypeDuration]);
    currentTypeDuration = INITIAL_TYPE_DURATION;
  });

  durationByTypeDataArray.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  durationByTypeDataArray.forEach((durationByTypeInstance) => {
    durationByTypeDataObject[durationByTypeInstance[ARRAY_INDEX_ZERO]] =
    durationByTypeInstance[ARRAY_INDEX_ONE];
  });

  return durationByTypeDataObject;
};
