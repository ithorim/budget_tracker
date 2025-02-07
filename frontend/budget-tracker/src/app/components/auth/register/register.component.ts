import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  fullName: string = '';
  email: string = '';
  password: string = '';

  register() {
    
  }
}
