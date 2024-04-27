import { User } from "./user";

export interface Post {
  id: number;
  title: string;
  description: string;
  private: boolean;
  createdAt: Date;
  username: string;

  picturesIds: number[];
  
  likes: number[];
  stars: number[];

  comments: Comment[],

}
