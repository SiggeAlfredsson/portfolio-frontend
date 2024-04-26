import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { switchMap } from 'rxjs';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { AuthService } from '../../services/auth.service';

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
  posts: Post[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username'); // never used?

    this.route.params.subscribe((params) => {
      this.username = params['username'];
      if (this.username) {
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    if (this.authService.isAuth()) {
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
          this.loadPosts(user.username);
        },
        error: (error) => console.error('Failed to load user profile:', error),
      });
    } else {
      this.userService.getUserByUsername(this.username!).subscribe((user) => {
        this.user = user;
        this.loadPosts(user.username);
      })
    }
    // Get the followings first and then load the user profile

  }

  loadPosts(username: string) {
    this.postService.getUserPosts(username).subscribe(posts => {
      this.posts = posts;
    });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
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
