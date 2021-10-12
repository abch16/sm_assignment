import fetch from 'node-fetch';
import { ErrorResponse } from '../customTypes/ErrorResponse';
export default class RestClient {
    static async makeRequest(request, url) {
        const response = await fetch(url, request);
        try {
            await response.json().then(data => {
                response.parsedBody;
            });
        }
        catch (error) {
            console.error('error making request for request : ', url, 'error: ', error);
            if (error instanceof ErrorResponse) {
                throw error;
            }
        }
        if (!response.ok) {
            const errorMessage = 'Error occurred in making API request';
            throw RestClient.createErrorResponse(response.statusText, errorMessage, response.status);
        }
        return response;
    }
    static createErrorResponse(statusText, message, status) {
        const errResponse = new ErrorResponse(statusText, message, status);
        console.error('Created custom error response: ', errResponse);
        return errResponse;
    }
}
