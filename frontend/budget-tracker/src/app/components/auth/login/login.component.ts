import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService }from '../../../services/auth.service';
import { AuthResponse, User } from '../../../models/auth.models';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  user: User = {
    email: '',
    password: ''
  }

  login(): void {
    this.authService.login(this.user).subscribe({
      next: (res: AuthResponse) => {
        localStorage.setItem("token", res.token);
        this.router.navigate(['dashboard']);
      }, error: (error) => {
        alert("Error while trying to login!");
        console.error('Registration error:', error);
      }
    })
  }

}