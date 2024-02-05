import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthService {
  user = new Subject<User>();

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
        catchError(this.handleError),
        tap((resData) => {
          this.handlingAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBC7B82PO-zuQE2SnSu6DQnVPAZ3zHLkZY',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handlingAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handlingAuth(
    email: string,
    id: string,
    token: string,
    expDate: number
  ) {
    const _expirationDate = new Date(new Date().getTime() + expDate * 1000);
    const user = new User(email, id, token, _expirationDate);
    this.user.next(user);
  }

  private handleError(errResp: HttpErrorResponse) {
    let errMessage = 'An unknown error occurred!';
    console.log(errResp);

    if (!errResp.error || !errResp.error.error) {
      return throwError(errMessage);
    }
    switch (errResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errMessage = 'This email exists already!';
      case 'EMAIL_NOT_FOUND':
        errMessage = 'This email is not registered';
      case 'INVALID_PASSWORD':
        errMessage = 'Wrong password';
      case 'INVALID_LOGIN_CREDENTIALS':
        errMessage = 'Invalid loggin data';
    }
    return throwError(errMessage);
  }
}
