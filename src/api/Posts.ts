import moment from 'moment';
import { AveragePostUser, AverageStatsMonth } from '../customTypes/AvergeStats';
import { CountStats } from '../customTypes/CountStats';
import { PostDTO } from '../customTypes/PostDTO';
import { HttpResponse, RestClient } from '../util/RestClient';

export class Posts {
  public static MONTH = 'Month';
  public static USER = 'User';
  public static WEEK = 'Week';
  public static SL_TOKEN = 'sl_token';
  public static PAGE = 'page';
  public static FETCH_POSTS_URL = 'https://api.supermetrics.com/assignment/posts';
  public static MAX_PAGE_NO = 10;

  public async getPosts(token: string, pageNo: number): Promise<PostDTO[]> {
    console.log('token' + token);
    const urlParam: Map<string, any> = new Map();
    urlParam.set(Posts.SL_TOKEN, token);
    urlParam.set(Posts.PAGE, pageNo);
    const request: string = RestClient.createGetUrl(Posts.FETCH_POSTS_URL, urlParam);
    console.log(request);
    const results: HttpResponse<any> = await RestClient.makeRequest(request);
    const postResults: PostDTO[] = results.parsedBody.data.posts;
    if (pageNo <= Posts.MAX_PAGE_NO) {
      return postResults.concat(await this.getPosts(token, pageNo + 1));
    } else {
      return postResults;
    }
  }

  public static getMonth(createTime: string): string {
    const postDate: Date = new Date(createTime);
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m[postDate.getMonth()];
  }

  public getGroupedByMonth(data: PostDTO[], byType: string): { [key: string]: PostDTO[] } {
    return data.reduce((m, d) => {
      let keyValue = '';
      if (byType == Posts.USER) {
        keyValue = d.from_id;
      }
      if (byType == Posts.MONTH) {
        keyValue = Posts.getMonth(d.created_time);
      }
      m[keyValue] = [...(m[keyValue] || []), d];
      return m;
    }, {} as { [key: string]: PostDTO[] });
  }

  private static getWeek(datStr: string): number {
    const d: Date = new Date(datStr);
    return moment(d).week();
  }

  public getTotalByKeyValue(data: PostDTO[], byType: string): any {
    return data.reduce((m, d) => {
      let key = 0;
      if (byType == Posts.WEEK) {
        key = Posts.getWeek(d.created_time);
      }
      m[key] = (m[key] || 0) + 1;
      return m;
    }, Object.create({}));
  }

  public getAverageStatsByMonth(groupData: { [key: string]: PostDTO[] }): AverageStatsMonth[] {
    return Object.keys(groupData).map(key => {
      const stats: AverageStatsMonth = {
        month: key,
        averageMessage:
          groupData[key].reduce((sum: number, currentObj: PostDTO) => {
            return sum + currentObj.message.length;
          }, 0) / groupData[key].length,
        longestPost: groupData[key].reduce((longest: number, currentObj: PostDTO) => {
          if (longest < currentObj.message.length) {
            longest = currentObj.message.length;
          }
          return longest;
        }, 0),
        averageUserPost: this.getAverageUserStats(this.getGroupedByMonth(groupData[key], Posts.USER)),
      };
      return stats;
    });
  }

  public getAverageUserStats(data: { [key: string]: PostDTO[] }): AveragePostUser[] {
    return Object.keys(data).map(key => {
      const stats: AveragePostUser = {
        user: key,
        postCount: data[key].length,
      };
      return stats;
    });
  }
}
