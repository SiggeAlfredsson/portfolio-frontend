import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PictureService } from '../../services/picture.service';
import { ImageDialogComponent } from '../../dialogs/image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  page = 0;
  notEmptyPost = true;
  notScrolly = true;
  images: { [key: number]: SafeUrl[] } = {}; // Store images by post ID

  loggedInUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private postService: PostService,
    private router: Router,
    private pictureService: PictureService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.loadInitialPosts();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadInitialPosts() {
    this.posts = [];

    this.postService.getPublicPosts(this.page).subscribe((res) => {
      this.posts = res.content;
      this.notEmptyPost = !!res.content.length;
      this.page++;
      this.posts.forEach((post) => {
        this.pictureService.getUserPicture(post.userId).subscribe(blob => {
          post.userImageUrl = URL.createObjectURL(blob);
        });
        this.userService.getUserById(post.userId).subscribe((user) => {
          post.username = user.username;
        });

        if (post.picturesIds) {
          this.images[post.id] = [];
          post.picturesIds.forEach((id) => {
            this.loadImage(id, post.id);
          });
        }
      });
    });
  }

  loadImage(imageId: number, postId: number) {
    this.pictureService.getImageById(imageId).subscribe((blob) => {
      const objectURL = URL.createObjectURL(blob);
      this.images[postId].push(
        this.sanitizer.bypassSecurityTrustUrl(objectURL)
      );
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      this.notScrolly &&
      this.notEmptyPost &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      this.notScrolly = false;
      this.loadNextPosts();
    }
  }

  loadNextPosts() {
    this.postService.getPublicPosts(this.page).subscribe((res) => {
      if (!res.content.length) {
        this.notEmptyPost = false;
      } else {
        this.page++;
        this.posts = [...this.posts, ...res.content];
        this.notScrolly = true;

        // now it loads for all images but should only load for new, to lazy rn to fix
        this.posts.forEach((post) => {
          this.pictureService.getUserPicture(post.userId).subscribe(blob => {
            post.userImageUrl = URL.createObjectURL(blob);
          });
          this.userService.getUserById(post.userId).subscribe((user) => {
            post.username = user.username;
          });


          if (post.picturesIds) {
            this.images[post.id] = [];
            post.picturesIds.forEach((id) => {
              this.loadImage(id, post.id);
            });
          }
        });
      }
    });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

  toggleLike(post: Post): void {
    console.log(post)
    if (this.loggedInUser) {
      this.postService.likePost(post.id).subscribe(() => {
        if (post.likes.includes(this.loggedInUser!.id)) {
          this.showSnackbar(`Unliked Post`);
          post.likes = post.likes.filter(
            (num) => num !== this.loggedInUser!.id
          );
        } else {
          this.showSnackbar(`Liked Post`);
          post.likes.push(this.loggedInUser!.id);
        }
      });
    } else {
      this.showSnackbar('Sign in to like post');
    }
  }

  isLikedByUser(post: Post): boolean {
    if (this.loggedInUser) {
      return post.likes.includes(this.loggedInUser.id);
    } else {
      return false;
    }
  }

  toggleStar(post: Post): void {
    if (this.loggedInUser) {
      this.postService.starPost(post.id).subscribe(() => {
        if (post.stars.includes(this.loggedInUser!.id)) {
          this.showSnackbar(`Unstared Post`);
          post.stars = post.stars.filter(
            (num) => num !== this.loggedInUser!.id
          );
        } else {
          this.showSnackbar(`Stared Post`);
          post.stars.push(this.loggedInUser!.id);
        }
      });
    } else {
      this.showSnackbar('Sign in to star post');
    }
  }

  isStaredByUser(post: Post): boolean {
    if (this.loggedInUser) {
      return post.stars.includes(this.loggedInUser.id);
    } else {
      return false;
    }
  }

  openImageDialog(imageSrc: any) {
    console.log(imageSrc);
    this.dialog.open(ImageDialogComponent, {
      data: { imgSrc: imageSrc },
      width: 'auto',
      maxHeight: '90vh',
    });
  }

  showSnackbar(content: string) {
    this._snackBar.open(content, '', {
      duration: 2000,
    });
  }
}
