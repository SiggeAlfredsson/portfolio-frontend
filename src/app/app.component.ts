import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { Router } from '@angular/router';
import { User } from './core/models/user';
import { Subscription, take } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'portfolio-frontend';
  isLoggedIn?: boolean;
  isLoading: boolean = false;
  user: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (token) {
      this.isLoading = true;
      this.authService.validateJwtToken(token).subscribe((res) => {
        this.isLoading = false;
        if(res) {
          this.isLoggedIn = true;
        }
      })
    }

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  login() {
    window.location.href = `${environment.baseHref}login`;
  }

  register() {
    window.location.href = `${environment.baseHref}register`;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }

  onToggleChange(): void {
    this.themeService.toggleDarkMode();
  }

  goToUserProfile() {
    this.router.navigate(['/user', this.user?.username]);
  }

}
