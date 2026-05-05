import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [
        Validators.required, 
        Validators.minLength(3),
        // Regex para permitir solo letras, números, puntos, guiones y guiones bajos (evita caracteres extraños)
        Validators.pattern('^[a-zA-Z0-9._-]+$')
      ]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      const controls = this.loginForm.controls;
      
      if (controls['usuario'].errors?.['required'] || controls['contrasena'].errors?.['required']) {
        this.notificationService.show('warning', 'Por favor, completa todos los campos.');
      } else if (controls['usuario'].errors?.['pattern']) {
        this.notificationService.error('El usuario contiene caracteres no permitidos.');
      } else {
        this.notificationService.error('Por favor, revisa que los datos sean correctos.');
      }
      return;
    }

    const { usuario, contrasena } = this.loginForm.value;

    this.authService.login(usuario, contrasena).subscribe({
      next: () => {
        this.notificationService.success('¡Bienvenido de nuevo!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login error', err)
    });
  }
}
