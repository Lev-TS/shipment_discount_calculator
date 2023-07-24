import { type TransformOptions, type TransformCallback, Transform } from 'stream';

let hookedWritable: NodeJS.WritableStream;

export const useInject = (writable: NodeJS.WritableStream) => {
  hookedWritable = writable;
  return function inject(
    transform: (payload: any, _: BufferEncoding, next: TransformCallback) => void,
    options?: TransformOptions
  ) {
    return new Transform({
      transform,
      objectMode: true,
      ...options,
    });
  };
};

export const useIgnore = (next: TransformCallback) => {
  return function ignore(log?: string) {
    hookedWritable.write((log ? `${log} ignore` : 'ignore') + '\n');
    next();
  };
};
