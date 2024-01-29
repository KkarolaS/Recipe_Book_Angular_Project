import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBC7B82PO-zuQE2SnSu6DQnVPAZ3zHLkZY',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errResp) => {
          let errMessage = 'An unknown error occurred!';
          if (!errResp.error || !errResp.error.error) {
            return throwError(errMessage);
          }
          switch (errResp.error.error.message) {
            case 'EMAIL_EXISTS':
              errMessage = 'This email exists already!';
          }
          return throwError(errMessage);
        })
      );
  }
}
