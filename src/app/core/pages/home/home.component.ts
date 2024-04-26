import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Router } from '@angular/router';

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

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialPosts();
  }

  loadInitialPosts() {
    this.postService.getPublicPosts(this.page).subscribe(res => {
      this.posts = res.content;
      this.notEmptyPost = !!res.content.length;
      this.page++;
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
  
  

}