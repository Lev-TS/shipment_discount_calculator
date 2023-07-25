import type { TransformOptions, TransformCallback, Transform } from 'stream';

export enum Carrier {
  lp = 'lp',
  mr = 'mr',
}

export enum Size {
  s = 's',
  m = 'm',
  l = 'l',
}

export type PriceList = Record<Carrier, Record<Size, number>>;

export interface Config {
  writeableStream: NodeJS.WritableStream;
  priceList: PriceList;
  monthlyDiscountBudget: number;
  nthOfFreeLargeLP: number;
}

export interface ParsedPayload {
  context: {
    log: string;
  };
  data: {
    date: string;
    carrier: string;
    size: string;
  };
}

interface ValidatedData {
  date: string;
  carrier: Carrier;
  size: Size;
}

export interface ValidatedPayload {
  context: {
    log: string;
  };
  data: ValidatedData;
}

export interface ContextualizedPayload {
  context: {
    log: string;
    isNewMonth: boolean;
  };
  data: ValidatedData;
}

export type TransformerFunction<T> = (payload: T, encoding: BufferEncoding, cb: TransformCallback) => void;

export type Inject = (transformer: TransformerFunction<any>, options?: TransformOptions) => Transform;
