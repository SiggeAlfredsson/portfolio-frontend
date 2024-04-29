// In your create-post.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  postForm: FormGroup;
  files: File[] = [];
  imagePreviews: any[] = [];

  constructor(private fb: FormBuilder, private postService: PostService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      private: [false]  // default false
    });
  }

  onSubmit() {
    console.log("hello")
    if (this.postForm.valid) {
      this.postService.createNewPost(this.postForm.value, this.files).subscribe(
        post => {
          console.log(post)
          this.router.navigate(['/post/' + post.id]);

        },
        error => {
          console.error('Error creating post', error);
          // Handle errors here
        }
      );
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.files = [];
    this.imagePreviews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.files.push(file);

      // Create a URL for each selected file to use for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadPhotosClick(event: Event, fileInput: HTMLInputElement) {
    event.preventDefault(); 
    fileInput.click(); 
  }
  

}
