export enum Carrier {
  lp = 'lp',
  mr = 'mr',
}

export enum Size {
  small = 's',
  medium = 'm',
  large = 'l',
}

export type PriceList = Record<Carrier, Record<Size, number>>;

export interface Config {
  writeableStream: NodeJS.WritableStream;
  priceList: PriceList;
  monthlyDiscountBudget: number;
  nthOfFreeLargeLP: number;
}
