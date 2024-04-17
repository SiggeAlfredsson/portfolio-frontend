import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-frontend';


  isLoggedIn: boolean = false;
  //check on init is fi

  email: string | null = null;

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
  ) {
    this.isLoggedIn = this.authService.isAuth();
    this.email = localStorage.getItem('email');
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

}
