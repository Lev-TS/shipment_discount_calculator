import type { TransformerFunction, ValidatedPayload } from '../types';

export const useContextualize = (): TransformerFunction<ValidatedPayload> => {
  let prevDate = new Date('1900-01-01');

  return function contextualize(payload, _, next) {
    const currentDate = new Date(payload.data.date);
    const isNewMonth = prevDate.getMonth() !== currentDate.getMonth();

    prevDate = currentDate;

    next(null, {
      ...payload,
      context: {
        ...payload.context,
        isNewMonth,
      },
    });
  };
};
