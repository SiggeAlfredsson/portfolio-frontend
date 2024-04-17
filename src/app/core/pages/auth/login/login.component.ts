import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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

  signIn() {
    const emailValue = this.email.value as string;
  
    this.authService.login(emailValue, this.password).subscribe((loginSuccess) => {
      if (loginSuccess) {
        setTimeout(() => { // so that the auth is updated and sidenav is shown, 2 sec should be fine
          this.router.navigate(['/home']);
        }, 20000);
      } else {
        this.password = '';
  
        this._snackBar.open('Invalid email or password', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
      }
    });
  }
}
