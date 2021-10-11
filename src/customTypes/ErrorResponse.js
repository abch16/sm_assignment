export class ErrorResponse {
    constructor(statusText, errorMessage, httpStatus) {
        this.errorMessage = errorMessage;
        this.statusText = statusText;
        this.httpStatus = httpStatus;
    }
}
