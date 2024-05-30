import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { PictureService } from '../../services/picture.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  apiUrl: string = environment.pictureApi;

  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  postForm: FormGroup;
  file?: File;
  imagePreview: string | ArrayBuffer | null = null; // Single preview

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService,
    private pictureService: PictureService,
    private router: Router // Inject Router service
  ) {
    this.postForm = this.fb.group({
      username: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.postForm.patchValue({
      username: this.user.username,
      description: this.user.description
    });
  }

  closeModal() {
    this.close.emit();
    this.updateUrl();
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.user.username = this.postForm.get('username')?.value;
      this.user.description = this.postForm.get('description')?.value;
  
      let updateUserPictureObservable;
      if (this.file) {
        updateUserPictureObservable = this.pictureService.updateUserPicture(this.user.id, this.file);
      } else {
        updateUserPictureObservable = of(null);
      }
  
      updateUserPictureObservable.subscribe({
        next: () => {
          this.userService.updateUser(this.user).subscribe({
            next: () => {
              this._snackBar.open('Profile updated successfully!', 'Close', {
                duration: 3000
              });
              this.closeModal();
            },
            error: (err) => {
              this._snackBar.open(`Failed to update profile: ${err.message}`, 'Close', {
                duration: 3000
              });
            }
          });
        },
        error: (err) => {
          this._snackBar.open(`Failed to update picture: ${err.message}`, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;

      // Create a URL for the selected file to use for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadPhotosClick(event: Event, fileInput: HTMLInputElement) {
    event.preventDefault();
    fileInput.click();
  }

  private updateUrl() {
    const encodedUsername = encodeURIComponent(this.user.username);
    this.router.navigate([`/user/${encodedUsername}`]);
  }
}
