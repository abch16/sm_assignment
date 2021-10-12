import { ErrorResponse } from '../customTypes/ErrorResponse';
import fetch, { RequestInit, Response } from 'node-fetch';
export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
export class RestClient {
  public static async makeRequest<T>(url: string, request?: RequestInit): Promise<HttpResponse<T>> {
    const response: HttpResponse<any> = await fetch(url, request);
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = 'Error occurred in making API request';
      throw RestClient.createErrorResponse(response.statusText, errorMessage, response.status, error);
    }

    try {
      // may error if there is no body
      response.parsedBody = await response.json();
    } catch (ex) {}

    return response;
  }

  private static createErrorResponse(statusText: string, message: string, status: number, error: any): ErrorResponse {
    const errResponse = new ErrorResponse(statusText, message, status, error);
    console.error('Created custom error response: ', errResponse);
    return errResponse;
  }

  public static createPostRequest(method: string, dataObj: any): RequestInit {
    return {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataObj),
    };
  }

  public static createGetUrl(url: string, paramsMap: Map<any, any>): string {
    let urlparamas = '';
    for (const key of paramsMap.keys()) {
      urlparamas += key + '=' + paramsMap.get(key) + '&';
    }
    urlparamas = urlparamas.slice(0, -1);
    return url + '?' + urlparamas;
  }
}
