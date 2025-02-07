import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, User } from '../../../models/auth.models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) { }

  user: User = {
    name: '',
    email: '',
    password: ''
  }

  register(): void {
    this.authService.register(this.user).subscribe({
      next: (res: AuthResponse) => {
        localStorage.setItem("token", res.token);
        this.router.navigate(["dashboard"]);
      }, error: (error) => {
        alert("Error while trying to register!");
        console.error("Registration error:", error);
      }
    })
  }
}
