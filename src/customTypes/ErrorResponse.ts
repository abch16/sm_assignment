export class ErrorResponse {
  errorMessage: string;
  statusText: string;
  httpStatus: number;
  errorDetails: string;

  constructor(statusText: string, errorMessage: string, httpStatus: number, errorDetails: string) {
    this.errorMessage = errorMessage;
    this.statusText = statusText;
    this.httpStatus = httpStatus;
    this.errorDetails = errorDetails;
  }
}
