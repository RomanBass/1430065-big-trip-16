import { FilterType } from './const';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateTo > dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => point.dateFrom < dayjs()),
};
