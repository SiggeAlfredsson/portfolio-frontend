export interface User {
    id: number;
    username: string;
    password: string;
    description: string;
    pictureId: number;


    registeredAt: Date;
    lastSeen: Date;

    postsIds: number[],

    followersIds: number[];
    followingsIds: number[];
    isFollowing?: boolean;

  }