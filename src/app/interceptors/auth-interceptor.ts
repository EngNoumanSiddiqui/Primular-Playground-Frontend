import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { IUserInfo } from '../models';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let currentUser: IUserInfo = this.authService.getUserInfo();
    if (currentUser && currentUser.token) {
      httpRequest = httpRequest.clone({
        setHeaders: { Authorization: `bearer ${currentUser.token}` },
      });
    }
    return next.handle(httpRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Error:', error);
          this.authService.logout();
          this.router.navigate(['login']);
        } else {
          return throwError(error);
        }
      })
    );
  }
}
