import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserRegistration } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9._-]+$')]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+ ]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.notificationService.show('warning', 'Por favor, completa los campos correctamente.');
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, firstName, lastName, email, phone, password } = this.registerForm.value;

    const userData: UserRegistration = {
      username: username,
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      phone: phone
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.notificationService.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Registration error', err)
    });
  }
}
