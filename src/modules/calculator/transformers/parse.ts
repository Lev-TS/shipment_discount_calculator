import { TransformCallback } from 'stream';

import { useIgnore } from '@modules/calculator/hooks';

export const parse = (payload: any, _: BufferEncoding, next: TransformCallback) => {
  const ignore = useIgnore(next);

  const log = payload.toString();

  if (!log.length) {
    ignore(log);
    return;
  }

  const tuple = log.split(' ').filter((el: string) => el.length > 0);

  if (tuple.length !== 3) {
    ignore(log);
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
