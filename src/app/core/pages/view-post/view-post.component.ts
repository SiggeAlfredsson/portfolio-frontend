import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PictureService } from '../../services/picture.service';
import { PostService } from '../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../dialogs/image-dialog/image-dialog.component';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {
  post: any;
  images: SafeUrl[] = [];
  newCommentText: string = "";
  postId?: number;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private pictureService: PictureService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postIdStr = params.get('postId');
      if (postIdStr) {
        const postId = +postIdStr; 
        this.postId = postId
        this.loadPost();
      } else {
        console.error('Post ID is missing in the route parameters.');
      }
    });
  }

  loadPost() {
    if(this.postId) {
    this.postService.getPostById(this.postId).subscribe(post => {
      this.post = post;
      if (post && post.picturesIds) {
        console.log(post.picturesIds)
        post.picturesIds.forEach(id => {
          this.pictureService.getImageById(id).subscribe(blob => {
            const objectURL = URL.createObjectURL(blob);
            this.images.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
          });
        });
      }
    });
  }
}

  openImageDialog(imageSrc: any) {
    console.log(imageSrc)
    this.dialog.open(ImageDialogComponent, {
      data: { imgSrc: imageSrc },
      width: 'auto',
      maxHeight: '90vh'
    });
}

toggleLike(post: Post): void {
  this.postService.likePost(post.id).subscribe(() => {
    this.loadPost()
  })
}

toggleStar(post: Post): void {
  this.postService.starPost(post.id).subscribe(() => {
    this.loadPost()
  })  }
submitComment(): void {
  const comment = {
    postId: this.post.id,
    text: this.newCommentText
  };

  this.postService.addComment(comment.postId, comment.text).subscribe(() => {
    this.loadPost()
  })

  this.newCommentText = ''; // Clear the input after submission
}
}