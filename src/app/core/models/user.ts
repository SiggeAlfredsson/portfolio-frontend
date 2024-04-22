export interface User {
    id: number;
    username: string;
    password: string;
    description: string;
    pictureId: number;


    registeredAt: Date;
    lastSeen: Date;

    followersIds: User[]; //stackoverflow?
    followingsIds: User[]; //stackoverflow?
    isFollowing?: boolean; // Add this line

  }