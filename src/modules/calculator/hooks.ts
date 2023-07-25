import { type TransformCallback, Transform } from 'stream';
import type { Config, Inject } from './types';

let hookedConfig: Config;

export const hookConfig = (config: Config): Inject => {
  hookedConfig = config;

  return function inject(transform, options) {
    return new Transform({
      transform,
      objectMode: true,
      ...options,
    });
  };
};

export const useDispatchIgnore = (next: TransformCallback) => {
  return function dispatchIgnore(log?: string) {
    hookedConfig.writeableStream.write((log != null && log.length > 0 ? `${log} Ignored` : 'Ignored') + '\n');
    next();
  };
};

export const useDispatchDiscount = (next: TransformCallback, log: string) => {
  return function dispatchDiscount(price: number, discount: number) {
    hookedConfig.writeableStream.write(`${log} ${price.toFixed(2)} ${discount.toFixed(2)}\n`);
    next();
  };
};

export const useDispatchDefault = (next: TransformCallback, log: string, price: number, discount: string) => {
  return function dispatchDefault() {
    hookedConfig.writeableStream.write(`${log} ${price.toFixed(2)} ${discount}\n`);
    next();
  };
};

export const useConfig = (): Config => hookedConfig;
