// Have private variable outside the class,
// helps drastically reduce the library size
export const W = window;
export const C = W.console;
export const D = document;
export const WN = W.navigator;
export const WP = W.performance;
export const getDM = () => (WN as any).deviceMemory;
export const getHC = () => (WN as any).hardwareConcurrency;
