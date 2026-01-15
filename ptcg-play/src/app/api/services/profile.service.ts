import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { ProfileResponse, MatchHistoryResponse } from '../interfaces/profile.interface';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class ProfileService {

  constructor(
    private api: ApiService,
  ) { }

  public getMe() {
    return this.api.get<ProfileResponse>('/v1/profile/me');
  }

  public getUser(userId: number) {
    return this.api.get<ProfileResponse>('/v1/profile/get/' + userId);
  }

  public getMatchHistory(userId: number = 0, page: number = 0) {
    return this.api.get<MatchHistoryResponse>('/v1/profile/matchHistory/' + userId + '/' + page);
  }

  public changePassword(currentPassword: string, newPassword: string) {
    return this.api.post<Response>('/v1/profile/changePassword', {
      currentPassword,
      newPassword
    });
  }

  public changeEmail(email: string) {
    return this.api.post<Response>('/v1/profile/changeEmail', { email });
  }

  public getCardImagesUrl() {
    return this.api.get<{ ok: boolean; jsonUrl: string }>('/v1/profile/cardImagesUrl');
  }

  public setCardImagesUrl(jsonUrl: string) {
    return this.api.post<Response>('/v1/profile/setCardImagesUrl', { jsonUrl });
  }

  public getNightlyImagesUrl() {
    return this.api.get<{ ok: boolean; jsonUrl: string }>('/v1/profile/nightlyImagesUrl');
  }

  public setNightlyImagesUrl(jsonUrl: string) {
    return this.api.post<Response>('/v1/profile/setNightlyImagesUrl', { jsonUrl });
  }

  public updateUserRole(targetUserId: number, roleId: number) {
    return this.api.post<Response>('/v1/profile/updateRole', { targetUserId, roleId });
  }

}
