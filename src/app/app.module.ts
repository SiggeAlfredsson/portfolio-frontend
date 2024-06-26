import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './core/pages/auth/login/login.component';
import { RegisterComponent } from './core/pages/auth/register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './core/pages/home/home.component';
import {MatDividerModule} from '@angular/material/divider';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';
import { DiscoverUsersComponent } from './core/pages/discover-users/discover-users.component';
import { MatCardModule } from '@angular/material/card';
import { ViewPostComponent } from './core/pages/view-post/view-post.component';
import { ImageDialogComponent } from './core/dialogs/image-dialog/image-dialog.component';
import { UsersDialogComponent } from './core/dialogs/users-dialog/users-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreatePostComponent } from './core/pages/create-post/create-post.component';
import { EditProfileDialogComponent } from './core/dialogs/edit-profile-dialog/edit-profile-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    DiscoverUsersComponent,
    CreatePostComponent,
    ViewPostComponent,
    ImageDialogComponent,
    UsersDialogComponent,
    EditProfileDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatBadgeModule,
    CommonModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
