import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      let msg = 'An unexpected error occurred.';
      if (error.status === 0) msg = 'Cannot connect to the server.';
      else if (error.status === 404) msg = 'Resource not found.';
      else if (error.status >= 500) msg = 'Server error. Please try later.';
      else if (error.error && typeof error.error === 'string') msg = error.error;

      snack.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      return throwError(() => error);
    })
  );
};
