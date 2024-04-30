import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription, switchMap, take } from 'rxjs';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent } from '../../dialogs/users-dialog/users-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  username: string | null = null;
  followingIds: number[] = [];
  user!: User;
  posts: Post[] = [];
  loggedInUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.route.params.subscribe((params) => {
      this.username = params['username'];
      if (this.username) {
        this.fetchUser();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
          error: (error) =>
            console.error('Failed to load user profile:', error),
        });
    } else {
      this.userService.getUserByUsername(this.username!).subscribe((user) => {
        this.user = user;
        this.loadPosts(user.username);
      });
    }
    // Get the followings first and then load the user profile
  }

  loadPosts(username: string) {
    this.postService.getUserPosts(username).subscribe((posts) => {
      this.posts = posts;
    });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

  showFollowers(): void {
    this.userService.convertIdsToUsers(this.user.followersIds).pipe(take(1)).subscribe((users) => {
      this.dialog.open(UsersDialogComponent, {
        data: { 
          title: 'Followers',
          users: users
        }
      });
    })
  }

  showFollowing(): void {
    this.userService.convertIdsToUsers(this.user.followingsIds).pipe(take(1)).subscribe((users) => {
      this.dialog.open(UsersDialogComponent, {
        data: { 
          title: 'Following',
          users: users
        }
      });
    })
  }

  showStaredPosts() {

  }

  toggleFollow(user: User): void {
    if (user.isFollowing) {
      this.unFollowUser(user.id);
    } else {
      this.followUser(user.id);
    }
  }

  followUser(followId: number): void { //unsub
    this.userService.followUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, true);
    });
  }

  unFollowUser(followId: number): void { //unsub
    this.userService.unFollowUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, false);
    });
  }

  toggleLike(post: Post, event: MouseEvent): void {
    event.stopPropagation();

    this.postService.likePost(post.id).subscribe(() => {
      if(post.likes.includes(this.loggedInUser!.id)) {
        this.showSnackbar(`Unliked Post`);
        post.likes = post.likes.filter(num => num !== this.loggedInUser!.id)
      } else {
        this.showSnackbar(`Liked Post`);
        post.likes.push(this.loggedInUser!.id)
      }    });
  }

  isLikedByUser(post: Post): boolean {
    return post.likes.includes(this.loggedInUser!.id) ?? false;
  }

  toggleStar(post: Post,  event: MouseEvent): void {
    event.stopPropagation();

    this.postService.starPost(post.id).subscribe(() => {
      if(post.stars.includes(this.loggedInUser!.id)) {
        this.showSnackbar(`Unstared Post`);
        post.stars = post.stars.filter(num => num !== this.loggedInUser!.id)
      } else {
        this.showSnackbar(`Stared Post`);
        post.stars.push(this.loggedInUser!.id)
      }
    });
  }

  isStaredByUser(post: Post): boolean {
    return post.stars.includes(this.loggedInUser!.id) ?? false;    
  }

  updateFollowStatus(userId: number, isFollowing: boolean): void {
    this.fetchUser();
    this.user.isFollowing = isFollowing;
    if (isFollowing) {
      // this.showSnackbar(`Followed`);
      this.followingIds.push(userId);
    } else {
      // this.showSnackbar(`Unfollowed`);
      this.followingIds = this.followingIds.filter((id) => id !== userId);
    }
  }

  showSnackbar(content: string) {
    this._snackBar.open(content, '', {
      duration: 2000,
    });
  }
}