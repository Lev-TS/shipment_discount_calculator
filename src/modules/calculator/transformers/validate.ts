import { TransformCallback } from 'stream';

import { hasOwnProperty, isValidISODateWithoutHours } from '@lib/index';

import { ParsedPayload } from './types';
import { useIgnore } from '../hooks';
import { CARRIER_PRICE_LIST } from '../constants';

export const makeValidate = (carrierPriceList: typeof CARRIER_PRICE_LIST) =>
  function validate(payload: ParsedPayload, _: BufferEncoding, next: TransformCallback) {
    const ignore = useIgnore(next);

    const {
      context: { log },
      data: { carrier, size, date },
    } = payload;

    if (!isValidISODateWithoutHours(date)) {
      ignore(log);
      return;
    }

    if (!hasOwnProperty(carrierPriceList, carrier)) {
      ignore(log);
      return;
    }

    const nestedProperty = carrierPriceList[carrier];

    if (typeof nestedProperty !== 'object' || nestedProperty == null) {
      ignore(log);
      return;
    }

    if (!nestedProperty.hasOwnProperty(size)) {
      ignore(log);
      return;
    }

    next(null, payload);
  };
