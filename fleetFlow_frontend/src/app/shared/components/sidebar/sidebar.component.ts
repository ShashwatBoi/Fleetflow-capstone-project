import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  get role(): string { return this.auth.getRole() || ''; }
  get username(): string { return this.auth.getUsername() || ''; }
  logout(): void { this.auth.logout(); }
}
