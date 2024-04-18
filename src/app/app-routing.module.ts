import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './core/pages/auth/login/login.component';
import { RegisterComponent } from './core/pages/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './core/pages/home/home.component';
import { DiscoverUsersComponent } from './core/pages/discover-users/discover-users.component';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';

const routes: Routes = [


  /*

  Auth guard is never used? Should it be?

  */

  

  { path: 'login',title: "Login", component: LoginComponent, canActivate: [NoAuthGuard]},
  { path: 'register',title: "Register", component: RegisterComponent, canActivate: [NoAuthGuard]},
  { path: 'home', title: "Home", component: HomeComponent},
  { path: 'user/:username', title: "User Page", component: UserProfileComponent},
  { path: 'find-friends', title: "Find Friends", component: DiscoverUsersComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
