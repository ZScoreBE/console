import {catchError, OperatorFunction, throwError} from "rxjs";
import {zxcvbn} from "zxcvbn3";

export function catchSomethingWrong<T>(): OperatorFunction<T, T> {
  return catchError(err => {
    return throwError(() => 'ERRORS.somethingWentWrong');
  });
}

export function getPasswordStrengthScore(password: string): number {
  return zxcvbn(password)?.score ?? -1;
}

export function boolToString(value: boolean): string {
  return value ? "true": "false";
}

export function stringToBool(value: string): boolean {
  if (!value) return false;

  return value.toLowerCase() === "true";
}
