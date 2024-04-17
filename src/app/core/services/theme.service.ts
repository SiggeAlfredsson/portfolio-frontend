// theme.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeKey = 'darkMode';
  private darkMode = false;

  constructor() {
    // Load theme mode from local storage on service initialization
    this.loadDarkMode();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
    // Save theme mode to local storage after toggling
    this.saveDarkMode();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private saveDarkMode(): void {
    // Save the current theme mode to local storage
    localStorage.setItem(this.darkModeKey, JSON.stringify(this.darkMode));
  }

  private loadDarkMode(): void {
    // Load theme mode from local storage
    const storedDarkMode = localStorage.getItem(this.darkModeKey);
    // If the theme mode is found in local storage, parse and set it
    if (storedDarkMode !== null) {
      this.darkMode = JSON.parse(storedDarkMode);
      document.body.classList.toggle('dark-theme', this.darkMode);
    }
  }
}
