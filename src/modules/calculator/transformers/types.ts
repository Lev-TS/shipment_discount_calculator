import { Carrier, Size } from '../types';

export interface ParsedPayload {
  context: {
    log: string;
  };
  data: {
    date: string;
    carrier: string;
    size: string;
  };
}

interface ValidatedData {
  date: string;
  carrier: Carrier;
  size: Size;
}

export interface ValidatedPayload {
  context: {
    log: string;
  };
  data: ValidatedData;
}

export interface ContextualizedPayload {
  context: {
    log: string;
    isNewMonth: boolean;
  };
  data: ValidatedData;
}
