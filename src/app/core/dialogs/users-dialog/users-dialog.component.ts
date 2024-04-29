import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PictureService } from '../../services/picture.service';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrl: './users-dialog.component.scss'
})
export class UsersDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, users: User[] },
    private router: Router,
    private pictureService: PictureService,
  ) { }

  navigateToUser(username: string): void {
    this.dialogRef.close();
    this.router.navigate(['/user', username]);
    
  }

  ngOnInit(): void {
    this.data.users.forEach(user => {
      this.pictureService.getUserPicture(user.id).subscribe(blob => {
        user.imageUrl = URL.createObjectURL(blob);
      });
    });
  }

}
