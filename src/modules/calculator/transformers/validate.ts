import { isValidISODateWithoutHours } from '@lib/index';

import { Carrier, Size, type ParsedPayload, type TransformerFunction } from '../types';
import { useDispatchIgnore } from '../hooks';

export const validate: TransformerFunction<ParsedPayload> = (payload, _, next) => {
  const dispatchIgnore = useDispatchIgnore(next);

  const {
    context: { log },
    data: { carrier, size, date },
  } = payload;

  if (!isValidISODateWithoutHours(date)) {
    dispatchIgnore(log);
    return;
  }

  if (!(carrier in Carrier) || !(size in Size)) {
    dispatchIgnore(log);
    return;
  }

  next(null, payload);
};
