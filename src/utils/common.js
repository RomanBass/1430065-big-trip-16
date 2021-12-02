export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getDuration = (startDate, finishDate) => { // преобразование длительности путешествия из миллисекунд в человеческий формат
  const DurationInSeconds = (finishDate - startDate) / 1000;

  let daysNumber = Math.trunc(DurationInSeconds / 86400);
  let hoursNumber = Math.trunc(DurationInSeconds / 3600) - daysNumber * 24;
  let minutesNumber = Math.round(DurationInSeconds / 60) - hoursNumber * 60 - daysNumber * 1440;

  daysNumber = daysNumber > 9 ? daysNumber : `0${daysNumber}`;
  hoursNumber = hoursNumber > 9 ? hoursNumber : `0${hoursNumber}`;
  minutesNumber = minutesNumber > 9 ? minutesNumber : `0${minutesNumber}`;

  let duration = `${daysNumber}D ${hoursNumber}H ${minutesNumber}M`;
  duration = daysNumber === '00' ? `${hoursNumber}H ${minutesNumber}M` : duration;
  if (daysNumber === '00' && hoursNumber === '00') {
    duration =  `${minutesNumber}M`;
  }
  return duration;
};

export const updateItem = (items, update) => { // заменяет элемент массива на обновлённый элемент по ID-шнику
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const isOnline = () => window.navigator.onLine;
