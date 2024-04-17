import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
  ) {}

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
