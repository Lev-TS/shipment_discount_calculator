import { Readable, Writable } from 'stream';
import { createInterface } from 'readline';

import { read } from '../module';

export class SpyWritableStream extends Writable {
  data: any[] = [];

  constructor(options?: any) {
    super(options);
  }

  _write(chunk: any, _: BufferEncoding, callback: (error?: Error | null) => void) {
    this.data.push(chunk);
    callback();
  }
}

describe('calculator', () => {
  describe('parse transformer', () => {
    it('should pass correct logs', async () => {
      const mockData = ['2015-02-01 S', '2015-02-01 S LP', '\n'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, spyWritable);

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).toBe(`${mockData[0]} ignore\n`);
      expect(recordedLogs[1]).toBe(`${mockData[1]}\n`);
      expect(recordedLogs[2]).toBe('ignore\n');
    });
  });
});
