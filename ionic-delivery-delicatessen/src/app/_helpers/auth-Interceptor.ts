import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';
  private token: any;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authenticationService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authenticationService.getCurrentUser())
    .pipe(
      switchMap(user => {
        if (user !== null) {
          req = req.clone({
            headers: req.headers.set(this.AUTH_HEADER, 'bearer ' + user.token)
          });
        }
        return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

          return throwError(error);

      })
    );

      })
  );
  }

}