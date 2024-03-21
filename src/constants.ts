// Have private variable outside the class,
// helps drastically reduce the library size
export const W = globalThis;
export const C = W.console;
export const WN = W.navigator;
export const WP = W.performance;
export const getDM = () => (WN as any).deviceMemory;
export const getHC = () => (WN as any).hardwareConcurrency;
export const M = 'mark.'; // Mark Prefix
export const S = 'step.'; // Step Prefix
