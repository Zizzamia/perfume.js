import { IPerfumeDataConsumption } from './types';

export const cls = {
  value: 0,
};
export const clsMetricName = 'cls';
export const fcp = {
  value: 0,
};
export const lcp = {
  value: 0,
};
export const fcpEntryName = 'first-contentful-paint';
export const lcpMetricName = 'lcp';
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
export const tbtMetricName = 'tbt';
