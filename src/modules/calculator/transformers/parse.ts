import { useDispatchIgnore } from '../hooks';
import type { TransformerFunction } from '../types';

export const parse: TransformerFunction<Buffer> = (payload, _, next): void => {
  const dispatchIgnore = useDispatchIgnore(next);

  const log = payload.toString();

  if (log.length <= 0) {
    dispatchIgnore(log);
    return;
  }

  const tuple = log.split(' ').filter((el: string) => el.length > 0);

  if (tuple.length !== 3) {
    dispatchIgnore(log);
    return;
  }

  next(null, {
    context: {
      log,
    },
    data: {
      date: tuple[0],
      size: tuple[1].toLowerCase(),
      carrier: tuple[2].toLowerCase(),
    },
  });
};
