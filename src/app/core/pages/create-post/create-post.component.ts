// In your create-post.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';  // Update path as necessary

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  postForm: FormGroup;
  files: File[] = [];

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      private: [false]  // default false
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.postService.createNewPost(this.postForm.value, this.files).subscribe(
        response => {
          console.log('Post created successfully', response);
          // Handle successful creation here
        },
        error => {
          console.error('Error creating post', error);
          // Handle errors here
        }
      );
    }
  }

  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
  }
}
