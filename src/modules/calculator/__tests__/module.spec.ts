import { Readable, Writable } from 'stream';
import { createInterface } from 'readline';

import { type Config, read } from '../module';

class SpyWritableStream extends Writable {
  data: any[] = [];

  constructor(options?: any) {
    super(options);
  }

  _write(chunk: any, _: BufferEncoding, next: (error?: Error | null) => void): void {
    this.data.push(chunk);
    next();
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
  describe('parse', () => {
    it('should Ignored invalid inputs', async () => {
      const mockData = ['2015-02-01 M LP', '2015-02-01 S', '\n'];
      const chunkStream = Readable.from([mockData.join('\n')]);
      const lineStream = createInterface({
        input: chunkStream,
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const actual = spyWritable.data;

      expect(actual).toHaveLength(mockData.length);
      expect(actual[0]).not.toContain('Ignored');
      expect(actual[1]).toBe(`${mockData[1]} Ignored\n`);
      expect(actual[2]).toBe('Ignored\n');
    });
  });

  describe('validate', () => {
    it('should validate size', async () => {
      const mockData = ['2015-01-01 M LP', '2015-01-03 M LP', '2015-01-03 L LP', '2015-01-03 XS LP'];
      const chunkStream = Readable.from([mockData.join('\n')]);
      const lineStream = createInterface({
        input: chunkStream,
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const actual = spyWritable.data;

      expect(actual).toHaveLength(mockData.length);
      expect(actual[0]).not.toContain('Ignored');
      expect(actual[1]).not.toContain('Ignored');
      expect(actual[2]).not.toContain('Ignored');
      expect(actual[3]).toBe(`${mockData[3]} Ignored\n`);
    });

    it('should validate carrier', async () => {
      const mockData = ['2015-01-01 M LP', '2015-01-03 M MR', '2015-01-03 L DA'];
      const chunkStream = Readable.from([mockData.join('\n')]);
      const lineStream = createInterface({
        input: chunkStream,
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const actual = spyWritable.data;

      expect(actual).toHaveLength(mockData.length);
      expect(actual[0]).not.toContain('Ignored');
      expect(actual[1]).not.toContain('Ignored');
      expect(actual[2]).toBe(`${mockData[2]} Ignored\n`);
    });

    it('should validate date format is YYYY-MM-DD', async () => {
      const mockData = ['2015-01-01 M LP', '2015/01/01 M LP', '15-1-01 M LP', '2015-01- M LP', '2015-01 M LP'];
      const chunkStream = Readable.from([mockData.join('\n')]);
      const lineStream = createInterface({
        input: chunkStream,
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });
      const actual = spyWritable.data;

      expect(actual).toHaveLength(mockData.length);
      expect(actual[0]).not.toContain('Ignored');
      expect(actual[1]).toBe(`${mockData[1]} Ignored\n`);
      expect(actual[2]).toBe(`${mockData[2]} Ignored\n`);
      expect(actual[3]).toBe(`${mockData[3]} Ignored\n`);
      expect(actual[4]).toBe(`${mockData[4]} Ignored\n`);
    });
  });

  describe('contextualize & calculate', () => {
    it('should calculate discounts and attach to logs', async () => {
      const mockData = [
        '2015-02-01 S MR',
        '2015-02-02 S MR',
        '2015-02-03 L LP',
        '2015-02-05 S LP',
        '2015-02-06 S MR',
        '2015-02-06 L LP',
        '2015-02-07 L MR',
        '2015-02-08 M MR',
        '2015-02-09 L LP',
        '2015-02-10 L LP',
        '2015-02-10 S MR',
        '2015-02-10 S MR',
        '2015-02-11 L LP',
        '2015-02-12 M MR',
        '2015-02-13 M LP',
        '2015-02-15 S MR',
        '2015-02-17 L LP',
        '2015-02-17 S MR',
        '2015-02-24 L LP',
        '2015-02-29 CUSPS',
        '2015-03-01 S MR',
      ];
      const expected = [
        '2015-02-01 S MR 1.50 0.50',
        '2015-02-02 S MR 1.50 0.50',
        '2015-02-03 L LP 6.90 -',
        '2015-02-05 S LP 1.50 -',
        '2015-02-06 S MR 1.50 0.50',
        '2015-02-06 L LP 6.90 -',
        '2015-02-07 L MR 4.00 -',
        '2015-02-08 M MR 3.00 -',
        '2015-02-09 L LP 0.00 6.90',
        '2015-02-10 L LP 6.90 -',
        '2015-02-10 S MR 1.50 0.50',
        '2015-02-10 S MR 1.50 0.50',
        '2015-02-11 L LP 6.90 -',
        '2015-02-12 M MR 3.00 -',
        '2015-02-13 M LP 4.90 -',
        '2015-02-15 S MR 1.50 0.50',
        '2015-02-17 L LP 6.90 -',
        '2015-02-17 S MR 1.90 0.10',
        '2015-02-24 L LP 6.90 -',
        '2015-02-29 CUSPS Ignored',
        '2015-03-01 S MR 1.50 0.50',
      ].map((el) => el + '\n');
      const chunkStream = Readable.from([mockData.join('\n')]);
      const lineStream = createInterface({
        input: chunkStream,
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, { ...config, writeableStream: spyWritable });

      const actual = spyWritable.data;

      expect(actual).toHaveLength(mockData.length);
      expect(actual).toEqual(expected);
    });
  });
});
