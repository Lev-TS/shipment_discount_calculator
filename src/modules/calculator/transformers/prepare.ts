import { TransformCallback } from 'stream';
import { ParsedPayload } from './types';

export const prepare = (payload: ParsedPayload, _: BufferEncoding, next: TransformCallback) => {
  next(null, payload.context.log + '\n');
};
