import { type Interface } from 'readline';
import { pipeline } from 'stream/promises';

import { hookConfig } from '@modules/calculator/hooks';

import { useContextualize, useCalculate, parse, validate } from './transformers';
import type { Config } from './types';

const read: (readable: Interface, config: Config) => Promise<void> = async (readable, config) => {
  const inject = hookConfig(config);

  try {
    await pipeline(
      readable,
      inject(parse),
      inject(validate),
      inject(useContextualize()),
      inject(useCalculate()),
      config.writeableStream,
    );
  } catch (error) {
    console.error(error);
  }
};

export { read, type Config };
