import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  showPassword = false;

  constructor(private router: Router) {}

  onRegister() {
    // TODO: reemplazar con servicio de registro real
    if (this.fullName.trim() && this.email.trim() && this.password.trim()) {
      this.router.navigate(['/login']);
    }
  }
}
