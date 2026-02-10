import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { AvatarListResponse, AvatarResponse } from '../interfaces/avatar.interface';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class AvatarService {

  constructor(
    private api: ApiService,
  ) { }

  public getAvailableAvatars() {
    return this.api.get<AvatarListResponse>('/v1/avatars/available');
  }

  public getList(userId?: number) {
    if (userId !== undefined) {
      return this.api.get<AvatarListResponse>('/v1/avatars/list/' + userId);
    }
    return this.api.get<AvatarListResponse>('/v1/avatars/list');
  }

  public find(userId: number, name: string) {
    return this.api.post<AvatarResponse>('/v1/avatars/find', {
      id: userId,
      name
    });
  }

  public markAsDefault(avatarId: number, fileName?: string) {
    const body: { id: number, fileName?: string } = { id: avatarId };
    if (fileName !== undefined) {
      body.fileName = fileName;
    }
    return this.api.post<Response>('/v1/avatars/markAsDefault', body);
  }
}
