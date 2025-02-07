import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  @Input() headerText: string = 'Budget Tracker';
  @Input() descriptionText: string = 'Track your expenses with our simple and intuitive interface.';
} 