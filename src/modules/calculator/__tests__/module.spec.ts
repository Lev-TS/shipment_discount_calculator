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
      const mockData = ['2015-02-01 S LP', '2015-02-01 S', '\n'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, spyWritable);

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).toBe(`${mockData[0]}\n`);
      expect(recordedLogs[1]).toBe(`${mockData[1]} ignore\n`);
      expect(recordedLogs[2]).toBe('ignore\n');
    });
  });

  describe('validate transformer', () => {
    it('should validate size', async () => {
      const mockData = ['2015-01-01 S LP', '2015-01-03 M LP', '2015-01-03 L LP', '2015-01-03 XS LP'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, spyWritable);

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).toBe(`${mockData[0]}\n`);
      expect(recordedLogs[1]).toBe(`${mockData[1]}\n`);
      expect(recordedLogs[2]).toBe(`${mockData[2]}\n`);
      expect(recordedLogs[3]).toBe(`${mockData[3]} ignore\n`);
    });

    it('should validate carrier', async () => {
      const mockData = ['2015-01-01 S LP', '2015-01-03 M MR', '2015-01-03 L DA'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, spyWritable);

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).toBe(`${mockData[0]}\n`);
      expect(recordedLogs[1]).toBe(`${mockData[1]}\n`);
      expect(recordedLogs[2]).toBe(`${mockData[2]} ignore\n`);
    });

    it('should validate date format is YYYY-MM-DD', async () => {
      const mockData = ['2015-01-01 S LP', '2015/01/01 S LP', '15-1-01 S LP', '2015-01- S LP', '2015-01 S LP'];
      const lineStream = createInterface({
        input: Readable.from([mockData.join('\n')]),
        crlfDelay: Infinity,
      });

      const spyWritable = new SpyWritableStream({ objectMode: true });

      await read(lineStream, spyWritable);

      const recordedLogs = spyWritable.data;

      expect(recordedLogs).toHaveLength(mockData.length);
      expect(recordedLogs[0]).toBe(`${mockData[0]}\n`);
      expect(recordedLogs[1]).toBe(`${mockData[1]} ignore\n`);
      expect(recordedLogs[2]).toBe(`${mockData[2]} ignore\n`);
      expect(recordedLogs[3]).toBe(`${mockData[3]} ignore\n`);
      expect(recordedLogs[4]).toBe(`${mockData[4]} ignore\n`);
    });
  });
});
