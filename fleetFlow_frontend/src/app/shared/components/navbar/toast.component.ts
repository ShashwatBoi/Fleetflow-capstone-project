import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((t: Toast) => {
      this.toasts.push(t);
      setTimeout(() => this.toasts.shift(), 3000);
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}
