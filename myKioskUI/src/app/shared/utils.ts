import { HttpErrorResponse } from '@angular/common/http';

export function handleHttpError(op: string, objname: string, error: HttpErrorResponse | any): string {
    let errMsg: string = `Failed to ${op} ${objname}: `;

    if (error.error instanceof ErrorEvent) {
      errMsg += error.error.message;
    } else {
      errMsg += `${error.status} - ${error.statusText || ''}`;
    }
    return errMsg;
  }