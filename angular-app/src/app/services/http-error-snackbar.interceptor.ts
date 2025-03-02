import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessResponse } from '../models/success-response';

@Injectable()
export class HttpErrorSnackbarInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((ev: HttpErrorResponse) => {
        console.error(ev)
        const dbErrorsDescriptions = ev.error?.error?.errors?.map((er: SuccessResponse) => er.message)?.join(' ') ?? '';
        this.snackBar.open(`${ev.error?.message}. ${dbErrorsDescriptions}`, $localize `Close`);
        return throwError(() => ev);
      })
    );
  }
}
