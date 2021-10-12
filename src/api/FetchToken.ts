import moment from 'moment';
import { HttpResponse, RestClient } from '../util/RestClient';
import { RequestInit } from 'node-fetch';
import nconf from 'nconf';
export interface Token {
  client_id: string;
  email: string;
  name?: string;
  sl_token?: string;
}

export class FetchToken {
  public static TOKEN = 'token';
  public static DATE = 'date';
  public static FETCH_TOKEN_URL = 'https://api.supermetrics.com/assignment/register';
  public static HOUR = 60 * 60 * 1000;
  public static loadCache() {
    nconf.use('file', { file: './config.json' });
    nconf.load();
  }

  public static lessThanOneHourAgo(date: Date): boolean {
    return moment(date).isAfter(moment().subtract(1, 'hours'));
  }
  public static async getSlToken(meta: Token): Promise<Token> {
    if (nconf.get(FetchToken.TOKEN) && FetchToken.lessThanOneHourAgo(nconf.get(FetchToken.DATE))) {
      console.log('returning from cache');
      return nconf.get(FetchToken.TOKEN) as Token;
    }
    const request: RequestInit = RestClient.createPostRequest('POST', meta);
    const tokenRespose: HttpResponse<any> = await RestClient.makeRequest(FetchToken.FETCH_TOKEN_URL, request);
    const token: Token = tokenRespose.parsedBody.data as Token;
    nconf.set(FetchToken.TOKEN, token);
    nconf.set(FetchToken.DATE, new Date());
    nconf.save((err: any) => {
      if (err) {
        console.error('Error in saving token in cache' + err.message);
      }
    });
    return token;
  }
}
