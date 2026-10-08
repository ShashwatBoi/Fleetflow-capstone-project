import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showTruck = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        this.showTruck = true;
        setTimeout(() => {
          if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
          else if (res.role === 'MANAGER') this.router.navigate(['/manager/dashboard']);
          else this.router.navigate(['/driver/dashboard']);
        }, 1400);
      },
      error: () => { this.loading = false; this.error = 'Invalid username or password'; }
    });
  }

  f(name: string) { return this.form.get(name); }
}
