import { useConfig, useDispatchDefault, useDispatchDiscount } from '../hooks';
import { type ContextualizedPayload, Carrier, Size, type TransformerFunction } from '../types';

export const useCalculate = (): TransformerFunction<ContextualizedPayload> => {
  let discountBudget: number;
  let largeLPCount = 0;

  return function calculate(payload, _, next) {
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
      case Size.s: {
        const smallestPrice = Object.values(priceList).reduce(
          (acc: number, providerPrices) => (acc < providerPrices[Size.s] ? acc : providerPrices[Size.s]),
          defaultPrice,
        );

        if (smallestPrice === priceList[carrier][size]) {
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
      case Size.l: {
        if (carrier !== Carrier.lp) {
          dispatchDefault();
          break;
        }

        largeLPCount = isNewMonth ? 0 : largeLPCount + 1;

        if (largeLPCount > 0 && largeLPCount % nthOfFreeLargeLP !== 0) {
          dispatchDefault();
          break;
        }

        if (discountBudget >= defaultPrice) {
          dispatchDiscount(0, defaultPrice);
          discountBudget = discountBudget - defaultPrice;
          break;
        }

        dispatchDefault();
        break;
      }
      default:
        dispatchDefault();
        break;
    }
  };
};
