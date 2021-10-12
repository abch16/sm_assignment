import { FetchToken, Token } from './api/FetchToken';
import { Posts } from './api/Posts';
import { PostDTO } from './customTypes/PostDTO';

//nconf = require('nconf');
//nconf.file('./config.json')
FetchToken.loadCache();
getPosts();
async function getPosts() {
  const meta: Token = {
    client_id: 'ju16a6m81mhid5ue1z3v2g0uh',
    email: 'abhachandel@gmail.com',
    name: 'Abha Chandel',
  };
  const post: Posts = new Posts();
  const autthtoken: Token = await FetchToken.getSlToken(meta);
  console.log(autthtoken);
  console.log(autthtoken.sl_token);
  console.log('I am here ');
  try {
    const postArr: PostDTO[] = await post.getPosts(autthtoken.sl_token as string, 1);
    const groupedPost = post.getGroupedByMonth(postArr, Posts.MONTH);
    const averagePost = post.getAverageStatsByMonth(groupedPost);
    const totalByWeek = post.getTotalByKeyValue(postArr, Posts.WEEK);
    console.log('Total Posts Split By Week ' + JSON.stringify(totalByWeek));
    console.log('Average Post By Month' + JSON.stringify(averagePost));
  } catch (error) {
    console.log(error.message);
  }
}

