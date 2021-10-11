import RestClient from '../util/RestClient';
export class FetchToken {
  static async getSlToken(meta) {
    const url = 'https://api.supermetrics.com/assignment/register';
    const request = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta),
    };
    return RestClient.makeRequest(request, url);
  }
}
