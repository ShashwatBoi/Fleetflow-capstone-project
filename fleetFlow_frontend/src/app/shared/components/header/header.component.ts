import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-header', templateUrl: './header.component.html' })
export class HeaderComponent {
  constructor(public auth: AuthService) {}
  get initials(): string {
    const u = this.auth.getUsername() || '';
    return u.substring(0, 2).toUpperCase();
  }
}
