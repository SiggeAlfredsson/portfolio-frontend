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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  page = 0;
  notEmptyPost = true;
  notScrolly = true;
  images: { [key: number]: SafeUrl[] } = {}; // Store images by post ID

  constructor(
    private postService: PostService, 
    private router: Router,
    private pictureService: PictureService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadInitialPosts();
  }

  loadInitialPosts() {
    this.postService.getPublicPosts(this.page).subscribe(res => {
      this.posts = res.content;
      this.notEmptyPost = !!res.content.length;
      this.page++;
      this.posts.forEach(post => {
        if (post.picturesIds) {
          this.images[post.id] = [];
          post.picturesIds.forEach(id => {
            this.loadImage(id, post.id);
          });
        }
      });
    });
  }

  loadImage(imageId: number, postId: number) {
    this.pictureService.getImageById(imageId).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.images[postId].push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.notScrolly && this.notEmptyPost && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.notScrolly = false;
      this.loadNextPosts();
    }
  }
  
  loadNextPosts() {
    this.postService.getPublicPosts(this.page).subscribe(res => {
      if (!res.content.length) {
        this.notEmptyPost = false;
      } else {
        this.page++;
        this.posts = [...this.posts, ...res.content];
        this.notScrolly = true;
  
        // now it loads for all images but should only load for new, to lazy rn to fix
        this.posts.forEach(post => {
          if (post.picturesIds) {
            this.images[post.id] = [];
            post.picturesIds.forEach(id => {
              this.loadImage(id, post.id);
            });
          }
        });
      }
    });
  }
  

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  toggleLike(post: Post): void {
    // Implement like functionality
  }
  
  toggleStar(post: Post): void {
    // Implement star functionality
  }
  
  openImageDialog(imageSrc: any) {
    console.log(imageSrc)
    this.dialog.open(ImageDialogComponent, {
      data: { imgSrc: imageSrc },
      width: 'auto',
      maxHeight: '90vh'
    });
}

}