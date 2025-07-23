import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authHeader = environment.authHeader;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const requestBody = {
      email: email,
      phone: '',
      phoneCode: '965',
      password: password,
      deviceToken: '',
      deviceType: '',
      deviceModel: '',
      appVersion: '',
      osVersion: '',
    };

    return this.http
      .post<any>(`${this.apiUrl}/login`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          auth: this.authHeader,
        },
      })
      .pipe(
        tap((response) => {
          if (response.data && response.data.sessionToken) {
            document.cookie = `sessionToken=${response.data.sessionToken}; path=/;`;
          }
        })
      );
  }

  logout() {
    document.cookie =
      'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

