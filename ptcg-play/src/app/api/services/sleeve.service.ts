import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

import { Response } from '../interfaces/response.interface';
import { SleeveListResponse, SleeveResponse } from '../interfaces/sleeve.interface';

@Injectable()
export class SleeveService {
  constructor(private api: ApiService) { }

  public getPredefinedSleeves() {
    return this.api.get<SleeveListResponse>('/v1/sleeves/predefined');
  }

  public getList(userId?: number) {
    if (userId !== undefined) {
      return this.api.get<SleeveListResponse>('/v1/sleeves/list/' + userId);
    }
    return this.api.get<SleeveListResponse>('/v1/sleeves/list');
  }

  public find(userId: number, name: string) {
    return this.api.post<SleeveResponse>('/v1/sleeves/find', {
      id: userId,
      name
    });
  }

  public markAsDefault(sleeveId: number) {
    return this.api.post<Response>('/v1/sleeves/markAsDefault', {
      id: sleeveId
    });
  }
}
