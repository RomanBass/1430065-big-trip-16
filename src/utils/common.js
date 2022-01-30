export const getDuration = (startDate, finishDate) => { // преобразование длительности путешествия из миллисекунд в человеческий формат
  const durationInSeconds = (finishDate - startDate) / 1000;

  let daysNumber = Math.trunc(durationInSeconds / 86400);
  let hoursNumber = Math.trunc(durationInSeconds / 3600) - daysNumber * 24;
  let minutesNumber = Math.round(durationInSeconds / 60) - hoursNumber * 60 - daysNumber * 1440;

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

export const makeElementEnabled = (element) => (element.disabled = false);
export const makeElementDisabled = (element) => (element.disabled = true);

