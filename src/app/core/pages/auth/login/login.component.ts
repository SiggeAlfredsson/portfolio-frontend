import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  username = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }

  signIn() {
    const usernameValue = this.username.value as string;
  
    this.authService.login(usernameValue, this.password).subscribe((loginSuccess) => {
      if (loginSuccess) {
        this.showSnackbar(`Login successful`);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        this.password = '';
  
        this._snackBar.open('Invalid username or password', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
      }
    });
  }

    showSnackbar(content: string) {
      this._snackBar.open(content, '', {
        duration: 2000,
      });
    }
}
