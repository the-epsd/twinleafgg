import { Response } from './response.interface';

export interface SleeveInfo {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  sortOrder: number;
  imageUrl?: string;
}

export interface SleeveListResponse extends Response {
  sleeves: SleeveInfo[];
}
