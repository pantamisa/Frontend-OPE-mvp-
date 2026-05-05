import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado.';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 400 && error.error) {
            if (error.error.non_field_errors && error.error.non_field_errors.length > 0) {
              errorMessage = error.error.non_field_errors[0];
            } else if (typeof error.error === 'object') {
              // Extract first field error
              const firstKey = Object.keys(error.error)[0];
              const errorDetail = error.error[firstKey];
              errorMessage = Array.isArray(errorDetail) ? `${firstKey}: ${errorDetail[0]}` : `${firstKey}: ${errorDetail}`;
            } else if (error.error.detail) {
              errorMessage = error.error.detail;
            }
          } else if (error.status === 401) {
            errorMessage = 'Sesión expirada o no autorizada.';
          } else if (error.status === 403) {
            errorMessage = 'No tienes permisos para realizar esta acción.';
          } else if (error.status === 404) {
            errorMessage = 'El recurso solicitado no fue encontrado.';
          } else if (error.status >= 500) {
            errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
            // If we are in debug mode or want to show more detail (as per user request)
            if (error.error && typeof error.error === 'string' && error.error.includes('AttributeError')) {
                // Try to extract a meaningful part if it's a traceback (common in Django debug)
                errorMessage = 'Error en el servidor: ' + error.statusText;
            }
          } else if (error.error && error.error.detail) {
            errorMessage = error.error.detail;
          }
        }

        this.notificationService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
