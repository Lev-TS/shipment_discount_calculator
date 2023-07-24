import { Interface } from 'readline';
import { pipeline } from 'stream/promises';

import { useInject } from '@modules/calculator/hooks';

import { parse, prepare } from './transformers';
import { makeValidate } from './transformers/validate';
import { CARRIER_PRICE_LIST } from './constants';

export const read = async (readable: NodeJS.ReadableStream | Interface, writable: NodeJS.WritableStream) => {
  const inject = useInject(writable);

  const validate = makeValidate(CARRIER_PRICE_LIST);

  try {
    await pipeline(readable, inject(parse), inject(validate), inject(prepare), writable);
  } catch (error) {
    console.error(error);
  }
};
