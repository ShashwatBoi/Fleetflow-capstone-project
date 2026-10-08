import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest } from 'src/app/shared/models/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, req).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
      })
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/register`, req);
  }

  logout(): void { localStorage.clear(); this.router.navigate(['/auth/login']); }

  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  isLoggedIn(): boolean { return !!this.getToken(); }

  getSecurityQuestion(username: string): Observable<string> {
    return this.http.get(`${this.base}/security-question/${username}`, { responseType: 'text' });
  }

  verifyAnswer(username: string, answer: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.base}/verify-answer`, { username, answer });
  }

  resetPassword(username: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.base}/reset-password`, { username, newPassword }, { responseType: 'text' });
  }

  updatePassword(username: string, oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put(`${this.base}/update-password`, { username, oldPassword, newPassword }, { responseType: 'text' });
  }

  updateUsername(oldUsername: string, newUsername: string): Observable<string> {
    return this.http.put(`${this.base}/update-username`, { oldUsername, newUsername }, { responseType: 'text' });
  }

  updateCredentials(oldUsername: string, newUsername: string, newPassword: string): Observable<string> {
    return this.http.put(`${this.base}/update-credentials`, { oldUsername, newUsername, newPassword }, { responseType: 'text' });
  }

  setSecurityQuestion(username: string, question: string, answer: string): Observable<string> {
    return this.http.post(`${this.base}/set-security-question`, { username, question, answer }, { responseType: 'text' });
  }

  getOwnSecurityQuestion(username: string): Observable<string> {
    return this.http.get(`${this.base}/own-security-question/${username}`, { responseType: 'text' });
  }
}
