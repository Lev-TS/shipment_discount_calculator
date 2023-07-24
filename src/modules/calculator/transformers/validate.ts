import { TransformCallback } from 'stream';

import { hasOwnProperty, isValidISODateWithoutHours } from '@lib/index';

import { ParsedPayload } from './types';
import { useIgnore, useConfig } from '../hooks';

export const validate = (payload: ParsedPayload, _: BufferEncoding, next: TransformCallback) => {
  const { priceList } = useConfig();
  const ignore = useIgnore(next);

  const {
    context: { log },
    data: { carrier, size, date },
  } = payload;

  if (!isValidISODateWithoutHours(date)) {
    ignore(log);
    return;
  }

  if (!hasOwnProperty(priceList, carrier)) {
    ignore(log);
    return;
  }

  const nestedProperty = priceList[carrier];

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
