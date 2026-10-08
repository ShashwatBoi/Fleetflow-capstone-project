
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({ selector: 'app-register', templateUrl: './register.component.html' })
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['DRIVER', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['']
    });
  }

  register(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => { this.success = 'Registered successfully! Redirecting...'; setTimeout(() => this.router.navigate(['/auth/login']), 1500); },
      error: err => { this.loading = false; this.error = err.error || 'Registration failed'; }
    });
  }

  f(n: string) { return this.form.get(n); }
}
