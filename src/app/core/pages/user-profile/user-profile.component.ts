import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  loggedInUsername: string | null = null;
  username: string | null = null;

  followingIds: number[] = [];
  user!: User;
  // posts: any[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username');

    this.route.params.subscribe((params) => {
      this.username = params['username'];
      if (this.username) {
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    // Get the followings first and then load the user profile
    this.userService
      .getMyFollowings()
      .pipe(
        switchMap((followingUsers) => {
          this.followingIds = followingUsers;
          return this.userService.getUserByUsername(this.username!);
        })
      )
      .subscribe({
        next: (user) => {
          this.user = user;
          this.user.isFollowing = this.followingIds.includes(user.id);
        },
        error: (error) => console.error('Failed to load user profile:', error),
      });
  }

  showFollowers(): void {
    // Logic to display followers
    console.log('Followers:', this.user.followersIds);
  }

  showFollowing(): void {
    // Logic to display following
    console.log('Following:', this.user.followingsIds);
  }

  showPosts(): void {
    // Logic to display posts
    // console.log('Posts:', this.posts);
  }

  toggleFollow(user: User): void {
    if (!localStorage.getItem('username')) {
      alert('Please log in to follow users.');
      return;
    }
    if (user.isFollowing) {
      this.unFollowUser(user.id);
    } else {
      this.followUser(user.id);
    }
  }

  followUser(followId: number): void {
    this.userService.followUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, true);
    });
  }

  unFollowUser(followId: number): void {
    this.userService.unFollowUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, false);
    });
  }

  updateFollowStatus(userId: number, isFollowing: boolean): void {
    this.fetchUser();
    this.user.isFollowing = isFollowing;
    if (isFollowing) {
      this.followingIds.push(userId);
    } else {
      this.followingIds = this.followingIds.filter((id) => id !== userId);
    }
  }
}
