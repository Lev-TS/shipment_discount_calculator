import { type Interface } from 'readline';
import { pipeline } from 'stream/promises';

import { hookConfig } from '@modules/calculator/hooks';

import { useContextualize, useCalculate, parse, validate } from './transformers';

import type { Config } from './types';

const read = async (readable: Interface, config: Config) => {
  const inject = hookConfig(config);

  try {
    await pipeline(
      readable,
      inject(parse),
      inject(validate),
      inject(useContextualize()),
      inject(useCalculate()),
      config.writeableStream
    );
  } catch (error) {
    console.error(error);
  }
};

// export class Calc {
//   readable: Interface;
//   config: Config;

//   constructor(readable: Interface, config: Config) {
//     this.readable = readable;
//     this.config = config;
//   }

//   async read() {
//     const inject = hookConfig(this.config);

//     try {
//       await pipeline(
//         this.readable,
//         inject(parse),
//         inject(validate),
//         inject(contextualize),
//         inject(useCalculate()),
//         this.config.writeableStream
//       );

//       this.readable.close();
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

export { read, Config };
