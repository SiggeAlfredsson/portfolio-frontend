import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../enviroments/enviroment';

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

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService,
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

      this.userService.updateUser(this.user).subscribe(()=> {
      this._snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000
      });    
        this.closeModal();
      })
      // add error handling
    }
  }

  editProfilePicture() {
    // Implement logic for editing the profile picture
  }
}
