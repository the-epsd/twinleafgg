import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginRememberService {

  public token: string | null = null;
  public apiUrl: string | null = null;

  constructor() {
    this.token = window.localStorage.getItem('token');
    this.apiUrl = window.localStorage.getItem('apiUrl');
  }

  public rememberApiUrl(apiUrl?: string) {
    this.apiUrl = apiUrl ?? null;
    if (apiUrl === undefined) {
      window.localStorage.removeItem('apiUrl');
      return;
    }
    window.localStorage.setItem('apiUrl', apiUrl);
  }

  public rememberToken(token?: string) {
    this.token = token ?? null;
    if (token === undefined) {
      window.localStorage.removeItem('token');
      return;
    }
    window.localStorage.setItem('token', token);
  }

}
