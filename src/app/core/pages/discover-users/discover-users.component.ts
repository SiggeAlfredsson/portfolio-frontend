import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-discover-users',
    templateUrl: './discover-users.component.html',
    styleUrls: ['./discover-users.component.scss']
})
export class DiscoverUsersComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers(): void {
      const loggedInUsername = localStorage.getItem('username'); 
      this.userService.getAllUsers().subscribe((users: User[]) => {
          this.users = users.filter(user => user.username !== loggedInUsername);
          this.filteredUsers = this.users;
      }, error => {
          console.error('Failed to fetch users:', error);
      });
  }

  filterUsers(event: Event): void {
      const element = event.target as HTMLInputElement;
      const value = element.value;
      if (!value) {
          this.filteredUsers = this.users;
      } else {
          this.filteredUsers = this.users.filter(user => 
              user.username.toLowerCase().includes(value.toLowerCase()));
      }
  }

    followUser(username: string): void {
        console.log('Follow user:', username);
    }

    goToUserProfile(username: string): void {
        this.router.navigate(['/user', username]);
    }
}
