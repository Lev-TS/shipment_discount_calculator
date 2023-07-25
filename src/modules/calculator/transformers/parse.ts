import { TransformCallback } from 'stream';

import { useDispatchIgnore } from '@modules/calculator/hooks';

export const parse = (payload: any, _: BufferEncoding, next: TransformCallback) => {
  const dispatchIgnore = useDispatchIgnore(next);

  const log = payload.toString();

  if (!log.length) {
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
