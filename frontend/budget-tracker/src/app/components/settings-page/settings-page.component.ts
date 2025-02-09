import { Component, OnInit } from '@angular/core';
import { User } from '../../models/auth.models';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {

  constructor(private userService: UserService) {}

  successMessage = '';
  errorMessage = '';

  user: User = {
    name: '',
    email: '',
    password: ''
  }

  newPassword: string = '';
  confirmPassword: string = '';

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  updateProfile() {
    this.successMessage = 'Profile updated successfully';
    this.errorMessage = '';
  }

  updatePassword() {
    this.successMessage = 'Password updated successfully';
    this.errorMessage = '';
  }
}
