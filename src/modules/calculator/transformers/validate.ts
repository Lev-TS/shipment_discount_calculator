import { TransformCallback } from 'stream';

import { hasOwnProperty, isValidISODateWithoutHours } from '@lib/index';

import type { ParsedPayload } from '../types';
import { useDispatchIgnore, useConfig } from '../hooks';

export const validate = (payload: ParsedPayload, _: BufferEncoding, next: TransformCallback) => {
  const { priceList } = useConfig();
  const dispatchIgnore = useDispatchIgnore(next);

  const {
    context: { log },
    data: { carrier, size, date },
  } = payload;

  if (!isValidISODateWithoutHours(date)) {
    dispatchIgnore(log);
    return;
  }

  if (!hasOwnProperty(priceList, carrier)) {
    dispatchIgnore(log);
    return;
  }

  const nestedProperty = priceList[carrier];

  if (typeof nestedProperty !== 'object' || nestedProperty == null) {
    dispatchIgnore(log);
    return;
  }

  if (!nestedProperty.hasOwnProperty(size)) {
    dispatchIgnore(log);
    return;
  }

  next(null, payload);
};
