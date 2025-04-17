import { Response } from './response.interface';
import { SleeveInfo } from 'ptcg-server';

export interface SleeveResponse extends Response {
  sleeve: SleeveInfo;
}

export interface SleeveListResponse extends Response {
  sleeves: SleeveInfo[];
}
