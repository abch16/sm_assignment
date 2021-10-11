export interface AverageStatsMonth {
  month: string;
  averageMessage: number;
  longestPost: number;
  averageUserPost: AveragePostUser[];
}
export interface AveragePostUser {
  user: string;
  postCount: number;
}
