import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-discover-users',
  templateUrl: './discover-users.component.html',
  styleUrls: ['./discover-users.component.scss'],
})
export class DiscoverUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  followingIds: number[] = [];
  
  user: User | null = null; // the one that is logged in
  private userSubscription!: Subscription;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {

    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  
    if (this.authService.isAuth()) {
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
          isFollowing: this.followingIds.includes(user.id)
        }));
  
        if (this.user) {
          this.filteredUsers = this.users.filter(user => user.username !== this.user!.username);
        } else {
          this.filteredUsers = this.users;
        }
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
