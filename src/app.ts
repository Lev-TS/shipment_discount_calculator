import { createReadStream } from 'fs';

import { createInterface } from 'readline';
import { calculator } from './modules';

const chunkStream = createReadStream(process.argv[2], { encoding: 'utf8' });

const lineStream = createInterface({
  input: chunkStream,
  crlfDelay: Infinity,
});

const config: calculator.Config = {
  writeableStream: process.stdout,
  nthOfFreeLargeLP: 3,
  monthlyDiscountBudget: 10,
  priceList: {
    lp: {
      s: 1.5,
      m: 4.9,
      l: 6.9,
    },
    mr: {
      s: 2.0,
      m: 3.0,
      l: 4.0,
    },
  },
};

calculator.read(lineStream, config).catch((error) => {
  console.error(error);
});
