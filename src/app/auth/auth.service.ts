import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

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
  user = new BehaviorSubject<User>(null);
  private tokenExpTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

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

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expDuration);
    }
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

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimeout) {
      clearTimeout(this.tokenExpTimeout);
    }
    this.tokenExpTimeout = null;
  }

  autoLogout(expDuration: number) {
    this.tokenExpTimeout = setTimeout(() => {
      this.logout();
    }, expDuration);
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
    this.autoLogout(expDate * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
