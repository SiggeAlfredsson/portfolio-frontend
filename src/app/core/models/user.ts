export interface User {
    id: number;
    username: string;
    password: string;
    description: string;
    pictureId: number;


    registeredAt: Date;
    lastSeen: Date;

    postsIds: number[];

    likedPostsIds: number[];
    starredPostsIds: number[];
    commentsIds: number[];


    followersIds: number[];
    followingsIds: number[];
    isFollowing?: boolean;


  }