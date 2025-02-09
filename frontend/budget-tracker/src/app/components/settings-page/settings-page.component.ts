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
  }

  updatedUser: User = {
    name: '',
    email: '',
    password: ''
  }

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  private emailExists = false;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.updatedUser = {
        name: user.name,
        email: user.email,
        password: ''
      };
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

  showEmailExistsError(): boolean {
    return this.emailExists && this.updatedUser.email !== this.user.email;
  }

  isEmailValid(): boolean {
    return !this.showEmailExistsError();
  }

  isProfileUpdateValid(): boolean {
    return (this.updatedUser.name !== this.user.name || 
            this.updatedUser.email !== this.user.email) &&
            this.isEmailValid();
  }

  updateProfile() {
    // clear any existing messages
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.isProfileUpdateValid() || !this.updatedUser.name || !this.updatedUser.email) {
        this.errorMessage = 'Please check your name and email entries';
        return;
    }

    this.userService.updateUserInfo(this.updatedUser.name, this.updatedUser.email)
        .subscribe({
            next: () => {
                this.successMessage = 'User information updated successfully';
                // Update the current user info to match the updated info
                this.user = {
                    ...this.user,
                    name: this.updatedUser.name,
                    email: this.updatedUser.email
                };
            },
            error: (error) => {
                if (error.status === 400) {
                    this.errorMessage = error.error.message;
                } else {
                    this.errorMessage = 'An error occurred while updating user information';
                }
            }
        });
  }

  updatePassword() {
    // Clear any existing messages
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.isPasswordChangeValid()) {
        this.errorMessage = 'Please check your password entries';
        return;
    }

    this.userService.updatePassword(this.currentPassword, this.newPassword)
        .subscribe({
            next: () => {
                this.successMessage = 'Password updated successfully';
                // Reset form
                this.currentPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
            },
            error: (error) => {
                if (error.status === 400) {
                    this.errorMessage = error.error.message;
                } else {
                    this.errorMessage = 'An error occurred while updating the password';
                }
            }
        });
  }

  onEmailChange() {
    if (this.updatedUser.email === this.user.email) {
        this.emailExists = false;
        return;
    }
    // when your subscribe to an Observable, you will receive the actuacl boolean value
    this.userService.checkEmailExists(this.updatedUser.email)
        .subscribe(exists => {
            this.emailExists = exists;
        });
  }
}
