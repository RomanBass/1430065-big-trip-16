import { TYPES, ARRAY_INDEX_ZERO, ARRAY_INDEX_ONE } from './const.js';

const INITIAL_TYPE_PRICE = 0;
const INITIAL_TYPE_NUMBER = 0;
const INITIAL_TYPE_DURATION = 0;

const getPointsByType = (points) => { // трансформирует массив точек в объект массивов точек выбранных по типу
  const pointsByType = {};
  let allPoints = points.slice();
  let filteredPoints;
  let remainingPoints;

  TYPES.forEach((type) => {
    filteredPoints = allPoints.filter((point) => point.type === type);

    if (!filteredPoints.length) {
      return pointsByType;
    }

    remainingPoints = allPoints.filter((point) => point.type !== type);
    allPoints = remainingPoints;

    if (filteredPoints.length) {
      pointsByType[type] = filteredPoints;
    }

  });

  return pointsByType;
};

export const getMoneyByTypeData = (points) => { // возвращает объект типа {..., тип: полная стоимость,...}

  const pairsOfMoneyByType = [];
  const moneyByTypeData = {};
  const pointsByType = getPointsByType(points);
  const currentTypes = Object.keys(pointsByType);

  let currentTypePrice = INITIAL_TYPE_PRICE;

  currentTypes.forEach((type) => {
    pointsByType[type].forEach((point) => {
      currentTypePrice += point.basePrice;
    });
    pairsOfMoneyByType.push([type.toUpperCase(), currentTypePrice]);
    currentTypePrice = INITIAL_TYPE_PRICE;
  });

  pairsOfMoneyByType.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  pairsOfMoneyByType.forEach((moneyByTypeInstance) => {
    moneyByTypeData[moneyByTypeInstance[ARRAY_INDEX_ZERO]] =
    moneyByTypeInstance[ARRAY_INDEX_ONE];
  });

  return moneyByTypeData;
};

export const getPointsNumberByTypeData = (points) => { // возвращает объект типа {..., тип: количество точек,...}

  const pairsOfnumberByType = [];
  const numberByTypeData = {};
  const pointsByType = getPointsByType(points);
  const currentTypes = Object.keys(pointsByType);

  let currentTypeNumber = INITIAL_TYPE_NUMBER;

  currentTypes.forEach((type) => {
    currentTypeNumber = pointsByType[type].length;
    pairsOfnumberByType.push([type.toUpperCase(), currentTypeNumber]);
    currentTypeNumber = INITIAL_TYPE_NUMBER;
  });

  pairsOfnumberByType.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  pairsOfnumberByType.forEach((numberByTypeInstance) => {
    numberByTypeData[numberByTypeInstance[ARRAY_INDEX_ZERO]] =
    numberByTypeInstance[ARRAY_INDEX_ONE];
  });

  return numberByTypeData;
};

export const getDurationByTypeData = (points) => { // возвращает объект типа {..., тип: полная стоимость,...}

  const pairsOfdurationByType = [];
  const durationByTypeData = {};
  const pointsByType = getPointsByType(points);
  const currentTypes = Object.keys(pointsByType);

  let currentTypeDuration = INITIAL_TYPE_DURATION;

  currentTypes.forEach((type) => {
    pointsByType[type].forEach((point) => {
      currentTypeDuration += point.dateTo - point.dateFrom;
    });
    pairsOfdurationByType.push([type.toUpperCase(), currentTypeDuration]);
    currentTypeDuration = INITIAL_TYPE_DURATION;
  });

  pairsOfdurationByType.sort((a,b) => b[ARRAY_INDEX_ONE] - a[ARRAY_INDEX_ONE]);

  pairsOfdurationByType.forEach((durationByTypeInstance) => {
    durationByTypeData[durationByTypeInstance[ARRAY_INDEX_ZERO]] =
    durationByTypeInstance[ARRAY_INDEX_ONE];
  });

  return durationByTypeData;
};
