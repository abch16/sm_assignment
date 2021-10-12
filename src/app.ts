import { FetchToken, Token } from './api/FetchToken';
import { Posts } from './api/Posts';
import { PostDTO } from './customTypes/PostDTO';
import posts from './data.json';

FetchToken.loadCache();

async function getPosts() {
  const meta: Token = {
    client_id: 'ju16a6m81mhid5ue1z3v2g0uh',
    email: 'abhachandel@gmail.com',
    name: 'Abha Chandel',
  };
  const post: Posts = new Posts();
  const autthtoken: Token = await FetchToken.getSlToken(meta);
  try {
    const postArr: PostDTO[] = await post.getPosts(autthtoken.sl_token as string, 1);
    const groupedPostByMonth = post.getGroupedByType(postArr, Posts.MONTH);
    const averagePostStats = post.getAverageStatsByMonth(groupedPostByMonth);
    const numberMonths = Object.keys(averagePostStats).length;
    const groupedPostByUser = post.getGroupedByType(postArr, Posts.USER);
    const totalByWeek = post.getTotalByType(posts.data, Posts.WEEK);
    const averagePostByUser = post.getAverageUserPosts(groupedPostByUser, numberMonths);
    console.log('Total Posts Split By Week => ' + JSON.stringify(totalByWeek));
    console.log('Average Post By Month => ' + JSON.stringify(averagePostStats));
    console.log('Average Post By User By Month =>' + JSON.stringify(averagePostByUser));
  } catch (error) {
    console.log(error.message);
  }
}
getPosts();
