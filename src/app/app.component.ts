import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-frontend';


  isLoggedIn: boolean = false;
  //check on init is fi

  username: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
  ) {
    this.isLoggedIn = this.authService.isAuth();
    this.username = localStorage.getItem('username');
  }

  login() {
    window.location.href = '/login';
  }

  register() {
    window.location.href = '/register';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }

  onToggleChange(): void {
    this.themeService.toggleDarkMode();
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/user', username]);
  }

}
