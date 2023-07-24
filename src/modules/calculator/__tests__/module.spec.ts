import { Readable, Writable } from 'stream';
import { createInterface } from 'readline';

import { Config, read } from '../module';

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

const config: Config = {
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

describe('calculator', () => {
  describe('parse transformer', () => {
    it('should ignore invalid inputs', async () => {
      const mockData = ['2015-02-01 M LP', '2015-02-01 S', '\n'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).not.toContain('ignore');
      expect(recordedLogs[1]).toBe(`${mockData[1]} ignore\n`);
      expect(recordedLogs[2]).toBe('ignore\n');
    });
  });

  describe('validate transformer', () => {
    it('should validate size', async () => {
      const mockData = ['2015-01-01 M LP', '2015-01-03 M LP', '2015-01-03 L LP', '2015-01-03 XS LP'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).not.toContain('ignore');
      expect(recordedLogs[1]).not.toContain('ignore');
      expect(recordedLogs[2]).not.toContain('ignore');
      expect(recordedLogs[3]).toBe(`${mockData[3]} ignore\n`);
    });

    it('should validate carrier', async () => {
      const mockData = ['2015-01-01 M LP', '2015-01-03 M MR', '2015-01-03 L DA'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).not.toContain('ignore');
      expect(recordedLogs[1]).not.toContain('ignore');
      expect(recordedLogs[2]).toBe(`${mockData[2]} ignore\n`);
    });

    it('should validate date format is YYYY-MM-DD', async () => {
      const mockData = ['2015-01-01 M LP', '2015/01/01 M LP', '15-1-01 M LP', '2015-01- M LP', '2015-01 M LP'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).not.toContain('ignore');
      expect(recordedLogs[1]).toBe(`${mockData[1]} ignore\n`);
      expect(recordedLogs[2]).toBe(`${mockData[2]} ignore\n`);
      expect(recordedLogs[3]).toBe(`${mockData[3]} ignore\n`);
      expect(recordedLogs[4]).toBe(`${mockData[4]} ignore\n`);
    });
  });
});
