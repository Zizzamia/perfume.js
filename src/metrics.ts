import { IMetricMap, IPerfumeDataConsumption } from './types';

export const metrics: IMetricMap = {};
export const fcp = {
  value: 0,
};
export const rt: { value: IPerfumeDataConsumption } = {
  value: {
    beacon: 0,
    css: 0,
    fetch: 0,
    img: 0,
    other: 0,
    script: 0,
    total: 0,
    xmlhttprequest: 0,
  },
};
export const tbt = {
  value: 0,
};
export const ntbt = {
  value: 0,
};
