import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PictureService } from '../../services/picture.service';
import { PostService } from '../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../dialogs/image-dialog/image-dialog.component';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Subscription, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit, OnDestroy {
  post: any;
  images: SafeUrl[] = [];
  newCommentText: string = '';
  postId?: number;

  //edit stuff
  isEditingPost: boolean = false;
  editTitle: FormControl = new FormControl('');
  editDescription: FormControl = new FormControl('');
  editPhotos: File[] = [];

  user: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private pictureService: PictureService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    this.route.paramMap.subscribe((params) => {
      const postIdStr = params.get('postId');
      if (postIdStr) {
        this.postId = +postIdStr;
        this.loadPost();
      } else {
        console.error('Post ID is missing in the route parameters.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadPost() {
    this.images = [];

    this.postService
      .getPostById(this.postId!)
      .pipe(take(1))
      .subscribe((post) => {
        this.userService.getUserById(post.userId).subscribe((user) => {
          post.username = user.username;
        });
        this.post = post;
        if (post && post.picturesIds) {
          this.images = [];
          post.picturesIds.forEach((id) => {
            this.pictureService
              .getImageById(id)
              .pipe(take(1))
              .subscribe((blob) => {
                const objectURL = URL.createObjectURL(blob);
                this.images.push(
                  this.sanitizer.bypassSecurityTrustUrl(objectURL)
                );
              });
          });
        }
      });
  }

  openImageDialog(imageSrc: any) {
    this.dialog.open(ImageDialogComponent, {
      data: { imgSrc: imageSrc },
      width: 'auto',
      maxHeight: '90vh',
    });
  }

  toggleLike(post: Post): void {
    if (this.user) {
      this.postService.likePost(post.id).subscribe(() => {
        if (post.likes.includes(this.user!.id)) {
          this.showSnackbar(`Unliked Post`);
          post.likes = post.likes.filter((num) => num !== this.user!.id);
        } else {
          this.showSnackbar(`Liked Post`);
          post.likes.push(this.user!.id);
        }
      });
    } else {
      this.showSnackbar('Sign in to like post');
    }
  }

  isLikedByUser(): boolean {
    return this.post.likes.includes(this.user?.id) ?? false;
  }

  toggleStar(post: Post): void {
    if (this.user) {
      this.postService.starPost(post.id).subscribe(() => {
        if (post.stars.includes(this.user!.id)) {
          this.showSnackbar(`Unstared Post`);
          post.stars = post.stars.filter((num) => num !== this.user!.id);
        } else {
          this.showSnackbar(`Stared Post`);
          post.stars.push(this.user!.id);
        }
      });
    } else {
      this.showSnackbar('Sign in to star post');
    }
  }

  isStaredByUser(): boolean {
    return this.post.stars.includes(this.user?.id) ?? false;
  }

  submitComment(): void {
    if (this.user) {
      const comment = {
        postId: this.post.id,
        text: this.newCommentText,
      };

      this.postService
        .addComment(comment.postId, comment.text)
        .subscribe(() => {
          this.showSnackbar(`Comment Added`);
          this.loadPost();
        });

      this.newCommentText = '';
    } else {
      this.showSnackbar('Sign in to comment');
    }
  }

  canEditComment(comment: Comment): boolean {
    return (
      (this.user &&
        (comment.username === this.user.username || this.user.admin)) ||
      false
    );
  }

  deleteComment(commentId: number): void {
    this.postService.deleteComment(commentId).subscribe(
      () => {
        this.showSnackbar(`Deleted Comment`);
        this.loadPost();
      },
      (error) => {
        console.error('Failed to delete comment:', error);
      }
    );
  }

  enableEdit(comment: Comment): void {
    comment.isEditing = true;
    comment.editText = comment.text; // temp store for the org text
  }

  saveComment(comment: Comment): void {
    comment.text = comment.editText;
    this.postService.editComment(comment.id, comment.text!).subscribe(
      () => {
        this.showSnackbar(`Comment Updated`);
        comment.isEditing = false;
        this.loadPost();
      },
      (error) => {
        console.error('Failed to save comment:', error);
      }
    );
  }

  cancelCommentEdit(comment: Comment): void {
    comment.isEditing = false;
  }

  canModifyPost(): boolean {
    return this.user?.admin || this.post?.username === this.user?.username;
  }

  deletePost(post: Post): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe(() => {
        this.showSnackbar(`Deleted Post`);
        this.router.navigate(['/home']);
      });
    }
  }

  enablePostEdit(): void {
    this.isEditingPost = true;
    this.editTitle.setValue(this.post.title);
    this.editDescription.setValue(this.post.description);
    // Photos are handled separately as File list
  }

  savePostChanges(): void {
    if (!this.post) return;
    const updatedPost = {
      ...this.post,
      title: this.editTitle.value,
      description: this.editDescription.value,
      // Photos handling can be implemented here
    };
    this.postService.updatePost(this.post.id, updatedPost).subscribe({
      next: (response) => {
        this.loadPost();
        this.isEditingPost = false;
        this.showSnackbar('Post updated successfully');
      },
      error: () => {
        this.showSnackbar('Failed to update post');
      },
    });
  }

  cancelPostEdit(): void {
    this.isEditingPost = false;
  }

  // this.showSnackbar(`message`);
  showSnackbar(content: string) {
    this._snackBar.open(content, '', {
      duration: 2000,
    });
  }
}
