import { type TransformCallback } from 'stream';
import type { ValidatedPayload } from './types';

let prevDate = new Date('1900-01-01');

export const contextualize = (payload: ValidatedPayload, _: BufferEncoding, next: TransformCallback) => {
  const currentDate = new Date(payload.data.date);
  const isNewMonth = prevDate && prevDate.getMonth() != currentDate.getMonth();

  prevDate = currentDate;

  next(null, {
    ...payload,
    context: {
      ...payload.context,
      isNewMonth,
    },
  });
};
