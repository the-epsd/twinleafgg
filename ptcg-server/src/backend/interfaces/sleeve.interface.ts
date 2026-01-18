export interface SleeveInfo {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface SleeveListResponse {
  ok: boolean;
  sleeves: SleeveInfo[];
}
