import type {TransformOptions, TransformCallback, Transform, Readable} from 'stream';
import type {Interface} from "readline";

export enum Carrier {
  lp = 'lp',
  mr = 'mr',
}

export enum Size {
  s = 's',
  m = 'm',
  l = 'l',
}

type Prices = Readonly<Record<Size, number>>;

export type PriceList = Readonly<Record<Carrier, Prices>>;

export interface Config {
  readonly writeableStream: NodeJS.WritableStream;
  readonly priceList: PriceList;
  readonly monthlyDiscountBudget: number;
  readonly nthOfFreeLargeLP: number;
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
export type Read = (readable: Readable | Interface, config: Config) => Promise<void>