import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { SleeveListResponse, SleeveInfo } from '../interfaces/sleeve.interface';
import { SessionService } from '../../shared/session/session.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SleeveService {

  constructor(
    private api: ApiService,
    private sessionService: SessionService
  ) { }

  public getList() {
    return this.api.get<SleeveListResponse>('/v1/sleeves/list').pipe(
      map(response => {
        const sleevesUrl = this.sessionService.session.config?.sleevesUrl || '';
        const apiUrl = this.api.getApiUrl();
        const sleeves = (response.sleeves || []).map((sleeve: SleeveInfo) => ({
          ...sleeve,
          imageUrl: sleeve.imagePath && sleevesUrl
            ? apiUrl + sleevesUrl.replace('{path}', sleeve.imagePath)
            : undefined
        }));
        return { ...response, sleeves };
      })
    );
  }
}
