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

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  isCurrentPasswordValid(): boolean {
    return this.currentPassword.length > 0;
  }

  areNewPasswordsValid(): boolean {
    return this.newPassword.length > 0 && 
           this.confirmPassword.length > 0 && 
           this.newPassword === this.confirmPassword &&
           this.newPassword !== this.currentPassword;
  }

  isPasswordChangeValid(): boolean {
    return this.isCurrentPasswordValid() && this.areNewPasswordsValid();
  }

  showPasswordMismatchError(): boolean {
    return this.confirmPassword.length > 0 && 
           this.newPassword !== this.confirmPassword;
  }

  updateProfile() {
    this.successMessage = 'Profile updated successfully';
    this.errorMessage = '';
  }

  updatePassword() {
    if (!this.isPasswordChangeValid()) {
      this.errorMessage = 'Please check your password entries';
      return;
    }
    
    this.successMessage = 'Password updated successfully';
    this.errorMessage = '';
    
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
