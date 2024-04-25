import { User } from "./user";

export interface Post {
  id: number;
  title: string;
  description: string;
  private: boolean;

  picturesIds: number[];
  
  stars: User[],
  likes: User[],
  comments: User[],

}
