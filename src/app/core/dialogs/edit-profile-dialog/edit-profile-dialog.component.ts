import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { PictureService } from '../../services/picture.service';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'] // Corrected property name
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
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.user.username = this.postForm.get('username')?.value;
      this.user.description = this.postForm.get('description')?.value;

      if (this.file) {
        this.pictureService.updateUserPicture(this.user.id, this.file).subscribe(()=> {
          this._snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000
          });    
            this.closeModal();
          })
      }

      this.userService.updateUser(this.user).subscribe(()=> {
      this._snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000
      });    
        this.closeModal();
      })
      // add error handling
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
}
