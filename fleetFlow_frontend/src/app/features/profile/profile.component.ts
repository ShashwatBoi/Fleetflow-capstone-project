import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';


@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent implements OnInit {
  username = '';
  role = '';
  passwordForm: FormGroup;
  usernameForm: FormGroup;
  securityForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private toast: ToastService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
    this.usernameForm = this.fb.group({ newUsername: ['', Validators.required] });
    this.securityForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.username = this.auth.getUsername() || '';
    this.role = this.auth.getRole() || '';
    this.usernameForm.patchValue({ newUsername: this.username });
    this.auth.getOwnSecurityQuestion(this.username).subscribe({
      next: q => this.securityForm.patchValue({ question: q }),
      error: () => {}
    });
  }

  get initials(): string { return this.username.substring(0, 2).toUpperCase(); }

  updatePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) { this.toast.show('Passwords do not match', 'error'); return; }
    this.auth.updatePassword(this.username, oldPassword, newPassword).subscribe({
      next: () => { this.toast.show('Password updated successfully'); this.passwordForm.reset(); },
      error: err => this.toast.show(err.error || 'Failed to update password', 'error')
    });
  }

  updateUsername(): void {
    if (this.usernameForm.invalid) return;
    const newUsername = this.usernameForm.value.newUsername;
    this.auth.updateUsername(this.username, newUsername).subscribe({
      next: () => {
        localStorage.setItem('username', newUsername);
        this.username = newUsername;
        this.toast.show('Username updated successfully');
        this.auth.getOwnSecurityQuestion(newUsername).subscribe({
          next: q => this.securityForm.patchValue({ question: q }),
          error: () => {}
        });
      },
      error: err => this.toast.show(err.error || 'Failed', 'error')
    });
  }

  setSecurityQuestion(): void {
    if (this.securityForm.invalid) { this.securityForm.markAllAsTouched(); return; }
    const { question, answer } = this.securityForm.value;
    this.auth.setSecurityQuestion(this.username, question, answer).subscribe({
      next: () => this.toast.show('Security question saved'),
      error: err => this.toast.show(err.error || 'Failed', 'error')
    });
  }

  pf(n: string) { return this.passwordForm.get(n); }
}
