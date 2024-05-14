import { User } from "./user";

export interface Post {
  id: number;
  title: string;
  description: string;
  private: boolean;
  createdAt: Date;
  username: string;
  userId: number;
  picturesIds: number[];
  
  likes: number[];
  stars: number[];

  comments: Comment[],

}
