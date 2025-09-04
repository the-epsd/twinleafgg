import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../../api/socket.service';

@Component({
  selector: 'ptcg-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public isConnected = false;
  public reconnectionStatus: any = {
    isReconnecting: false,
    currentAttempt: 0,
    maxAttempts: 3,
    nextRetryIn: 0
  };

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    // Subscribe to connection status
    this.socketService.connection
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.isConnected = connected;
      });

    // Subscribe to reconnection status
    this.socketService.reconnectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.reconnectionStatus = status;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getConnectionStatusText(): string {
    if (this.isConnected) {
      return 'Connected';
    } else if (this.reconnectionStatus.isReconnecting) {
      const nextRetryText = this.getNextRetryText();
      return `Reconnecting... (${this.reconnectionStatus.currentAttempt}/${this.reconnectionStatus.maxAttempts}) ${nextRetryText}`;
    } else {
      return 'Disconnected';
    }
  }

  public getNextRetryText(): string {
    if (this.reconnectionStatus.nextRetryIn > 0) {
      const seconds = Math.ceil(this.reconnectionStatus.nextRetryIn / 1000);
      return `- ${seconds}s`;
    }
    return '';
  }

  public getConnectionQuality(): string {
    // This could be enhanced with actual connection quality metrics
    if (this.isConnected) {
      return 'Good';
    } else if (this.reconnectionStatus.isReconnecting) {
      return 'Poor';
    } else {
      return 'None';
    }
  }

  public shouldShowTooltip(): boolean {
    return !this.isConnected;
  }

  public getTooltipText(): string {
    if (this.reconnectionStatus.isReconnecting) {
      return 'Connection lost. Attempting to reconnect automatically.';
    } else if (!this.isConnected) {
      return 'Connection lost. Please check your internet connection.';
    }
    return '';
  }

  public getConnectionStatusClass(): string {
    if (this.isConnected) {
      return 'connected';
    } else if (this.reconnectionStatus.isReconnecting) {
      return 'reconnecting';
    } else {
      return 'disconnected';
    }
  }

  public shouldShowStatus(): boolean {
    // Only show status when disconnected or reconnecting
    return !this.isConnected || this.reconnectionStatus.isReconnecting;
  }
}