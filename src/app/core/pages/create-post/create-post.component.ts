import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  postForm: FormGroup;
  files: File[] = [];
  imagePreviews: any[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      private: [false], // default false
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.postService.createNewPost(this.postForm.value, this.files).subscribe(
        (post) => {
          this.showSnackbar(`Post created`);
          this.router.navigate(['/post/' + post.id]);
        },
        (error) => {
          this.showSnackbar(`Error with creating post`);
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

  showSnackbar(content: string) {
    this._snackBar.open(content, '', {
      duration: 2000,
    });
  }
}
