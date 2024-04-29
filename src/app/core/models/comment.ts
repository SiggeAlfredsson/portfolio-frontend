import { Post } from "./post";

export interface Comment {
  id: number;
  text?: string;
  createdAt: Date;

  username: string;
  

  post: Post,

  isEditing?: boolean;
  editText?: string;

}