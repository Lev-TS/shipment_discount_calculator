import { type TransformOptions, type TransformCallback, Transform } from 'stream';
import type { Config } from './types';

let hookedConfig: Config;

export const hookConfig = (config: Config) => {
  hookedConfig = config;

  return function inject(
    transform: (payload: any, _: BufferEncoding, next: TransformCallback) => void,
    options?: TransformOptions
  ) {
    return new Transform({
      transform,
      objectMode: true,
      ...options,
    });
  };
};

export const useDispatchIgnore = (next: TransformCallback) => {
  return function ignore(log?: string) {
    hookedConfig.writeableStream.write((log ? `${log} ignore` : 'ignore') + '\n');
    next();
  };
};

export const useDispatchDiscount = (next: TransformCallback, log: string) => (price: number, discount: number) => {
  hookedConfig.writeableStream.write(`${log} ${price.toFixed(2)} ${discount.toFixed(2)}\n`);
  next();
};

export const useDispatchDefault = (next: TransformCallback, log: string, price: number, discount: string) => () => {
  hookedConfig.writeableStream.write(`${log} ${price.toFixed(2)} ${discount}\n`);
  next();
};

export const useConfig = () => hookedConfig;
