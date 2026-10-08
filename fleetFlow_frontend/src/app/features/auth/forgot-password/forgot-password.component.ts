import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({ selector: 'app-forgot-password', templateUrl: './forgot-password.component.html' })
export class ForgotPasswordComponent {
  step = 1;
  usernameForm: FormGroup;
  answerForm: FormGroup;
  resetForm: FormGroup;
  question = '';
  username = '';
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.usernameForm = this.fb.group({ username: ['', Validators.required] });
    this.answerForm = this.fb.group({ answer: ['', Validators.required] });
    this.resetForm = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(6)]] });
  }

  getQuestion(): void {
    if (this.usernameForm.invalid) return;
    this.username = this.usernameForm.value.username;
    this.auth.getSecurityQuestion(this.username).subscribe({
      next: q => { this.question = q; this.step = 2; this.error = ''; },
      error: () => this.error = 'User not found'
    });
  }

  verifyAnswer(): void {
    if (this.answerForm.invalid) return;
    this.auth.verifyAnswer(this.username, this.answerForm.value.answer).subscribe({
      next: ok => { if (ok) { this.step = 3; this.error = ''; } else this.error = 'Incorrect answer'; },
      error: () => this.error = 'Verification failed'
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) return;
    this.auth.resetPassword(this.username, this.resetForm.value.newPassword).subscribe({
      next: () => { this.success = 'Password reset! Redirecting...'; setTimeout(() => this.router.navigate(['/auth/login']), 1500); },
      error: () => this.error = 'Reset failed'
    });
  }
}
