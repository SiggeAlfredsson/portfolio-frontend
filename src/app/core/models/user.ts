export interface User {
    id: number;
    username: string;
    password: string;
    pictureId: number;
    following: User[]; //stackoverflow?
    follwers: User[]; //stackoverflow?
    isFollowing?: boolean; // Add this line

  }