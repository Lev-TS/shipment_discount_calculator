import type { TransformCallback } from 'stream';

import { useConfig, useDispatchDefault, useDispatchDiscount } from '../hooks';
import { type ContextualizedPayload, Carrier, Size } from '../types';

let discountBudget: number;
let largeLPCount = 0;

export const control = (payload: ContextualizedPayload, _: BufferEncoding, next: TransformCallback) => {
  const { priceList, monthlyDiscountBudget, nthOfFreeLargeLP } = useConfig();
  const {
    context: { isNewMonth, log },
    data: { carrier, size },
  } = payload;
  const defaultPrice = priceList[carrier][size];
  const dispatchDefault = useDispatchDefault(next, log, defaultPrice, '-');
  const dispatchDiscount = useDispatchDiscount(next, log);

  if (isNewMonth) {
    discountBudget = monthlyDiscountBudget;
  }

  if (discountBudget === 0) {
    dispatchDefault();
    return;
  }

  switch (size) {
    case Size.small: {
      const smallestPrice = Object.values(priceList).reduce(
        (acc: number, providerPrices) => (acc < providerPrices[Size.small] ? acc : providerPrices[Size.small]),
        defaultPrice
      );

      if (smallestPrice == priceList[carrier][size]) {
        dispatchDefault();
        break;
      }

      const maxDiscount = defaultPrice - smallestPrice;

      if (discountBudget >= maxDiscount) {
        next(null, `${log} ${smallestPrice.toFixed(2)} ${maxDiscount.toFixed(2)}\n`);
        discountBudget = discountBudget - maxDiscount;
        break;
      }

      dispatchDiscount(defaultPrice - discountBudget, discountBudget);
      discountBudget = 0;
      break;
    }
    case Size.large: {
      if (carrier !== Carrier.lp) {
        dispatchDefault();
        break;
      }

      largeLPCount = isNewMonth ? 0 : largeLPCount + 1;

      if (largeLPCount % nthOfFreeLargeLP !== 0) {
        dispatchDefault();
        break;
      }

      if (discountBudget >= defaultPrice) {
        dispatchDiscount(defaultPrice, defaultPrice);
        discountBudget = discountBudget - defaultPrice;
        break;
      }
    }
    default:
      dispatchDefault();
      break;
  }
};
