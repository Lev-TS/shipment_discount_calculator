import { createReadStream } from 'fs';
import { calculator } from './modules';
import { createInterface } from 'readline';

const chunkStream = createReadStream('input.txt', { encoding: 'utf8' });

const lineStream = createInterface({
  input: chunkStream,
  crlfDelay: Infinity,
});

calculator.read(lineStream, process.stdout);
