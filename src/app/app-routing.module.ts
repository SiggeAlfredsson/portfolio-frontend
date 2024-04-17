import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './core/pages/auth/login/login.component';
import { RegisterComponent } from './core/pages/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './core/pages/home/home.component';

const routes: Routes = [


  /*

  Maybe you should not need to be logged in to see all

  */

  // make into childer here for auth and no auth
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard]},
  { path: 'home', title: "SIGGEBIG - Home", component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
