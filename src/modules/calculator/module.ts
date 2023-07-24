import { type Interface } from 'readline';
import { pipeline } from 'stream/promises';

import { hookConfig } from '@modules/calculator/hooks';

import { contextualize, control, parse, validate } from './transformers';

import type { Config } from './types';

const read = async (readable: NodeJS.ReadableStream | Interface, config: Config) => {
  const inject = hookConfig(config);

  try {
    await pipeline(
      readable,
      inject(parse),
      inject(validate),
      inject(contextualize),
      inject(control),
      config.writeableStream
    );
  } catch (error) {
    console.error(error);
  }
};

export { read, Config };
