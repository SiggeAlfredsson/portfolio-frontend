import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  register() {
    const emailValue = this.email.value as string;

    this.authService.register(emailValue, this.password).subscribe((response) => {
      if (response) {
        this._snackBar.open('Registration successful', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      } else {
        this.password = '';
        this._snackBar.open('Registration failed', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
      }
    });
  }
}
