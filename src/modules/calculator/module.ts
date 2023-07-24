import { Interface } from 'readline';
import { pipeline } from 'stream/promises';

import { useInject } from '@modules/calculator/hooks';

import { parse, prepare } from './transformers';

export const read = async (readable: NodeJS.ReadableStream | Interface, writable: NodeJS.WritableStream) => {
  const inject = useInject(writable);

  try {
    await pipeline(readable, inject(parse), inject(prepare), writable);
  } catch (error) {
    console.error(error);
  }
};
