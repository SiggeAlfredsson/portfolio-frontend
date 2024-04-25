import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-discover-users',
  templateUrl: './discover-users.component.html',
  styleUrls: ['./discover-users.component.scss'],
})
export class DiscoverUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  followingIds: number[] = [];
  loggedInUsername?: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const loggedInUsername = localStorage.getItem('username');
    if(loggedInUsername){
        this.loggedInUsername = loggedInUsername;
    }
    if (loggedInUsername) {
        this.userService.getMyFollowings().subscribe({
          next: (followingUsers) => {
            this.followingIds = followingUsers;
            this.loadAllUsers();
          },
          error: (error) => {
            console.error('Failed to fetch followings:', error);
          }
        });
    } else {
        this.loadAllUsers();
    }
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users.map(user => ({
          ...user,
          isFollowing: this.loggedInUsername ? this.followingIds.includes(user.id) : false
        }));
        this.filteredUsers = this.users.filter(user => !this.loggedInUsername || user.username !== this.loggedInUsername);
      },
      (error) => {
        console.error('Failed to load all users:', error);
      }
    );
  }

  filterUsers(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    if (!value) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  toggleFollow(user: User): void {
    if (!localStorage.getItem('username')) {
      alert("Please log in to follow users.");
      return;
    }
    if (user.isFollowing) {
      this.unFollowUser(user.id);
    } else {
      this.followUser(user.id);
    }
  }

  followUser(followId: number): void {
    this.userService.followUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, true);
    });
  }

  unFollowUser(followId: number): void {
    this.userService.unFollowUser(followId).subscribe(() => {
      this.updateFollowStatus(followId, false);
    });
  }

  updateFollowStatus(userId: number, isFollowing: boolean): void {
    const index = this.filteredUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.filteredUsers[index].isFollowing = isFollowing;
      if (isFollowing) {
        this.filteredUsers[index].followersIds.length += 1;
      } else {
        this.filteredUsers[index].followersIds.length -= 1;
      }
    }
  }
  

  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }
}
