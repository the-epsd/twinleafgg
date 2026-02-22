import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../../api/socket.service';

interface ReconnectionDialogData {
  gameId?: number;
  showManualOptions?: boolean;
}

@Component({
  selector: 'ptcg-reconnection-dialog',
  templateUrl: './reconnection-dialog.component.html',
  styleUrls: ['./reconnection-dialog.component.scss']
})
export class ReconnectionDialogComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public reconnectionStatus: any = {
    isReconnecting: false,
    currentAttempt: 0,
    maxAttempts: 3,
    nextRetryIn: 0,
    error: ''
  };

  public showManualOptions = false;
  public isManualReconnecting = false;

  constructor(
    private dialogRef: MatDialogRef<ReconnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReconnectionDialogData,
    private socketService: SocketService
  ) {
    // Prevent dialog from being closed by clicking outside or pressing escape
    this.dialogRef.disableClose = true;

    // Add custom container class for styling
    this.dialogRef.addPanelClass('reconnection-dialog-container');
  }

  ngOnInit(): void {
    // Subscribe to reconnection status updates
    this.socketService.reconnectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.reconnectionStatus = status;
      });

    // Subscribe to reconnection events
    this.socketService.reconnectionEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        switch (event.type) {
          case 'success':
            this.handleReconnectionSuccess();
            break;
          case 'failed':
          case 'manual_required':
            this.showManualOptions = true;
            break;
        }
      });

    // Check if we should show manual options immediately
    if (this.data.showManualOptions) {
      this.showManualOptions = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public manualReconnect(): void {
    this.isManualReconnecting = true;
    this.showManualOptions = false;

    this.socketService.manualReconnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          if (success) {
            this.handleReconnectionSuccess();
          } else {
            this.handleManualReconnectionFailed();
          }
        },
        (error) => {
          this.handleManualReconnectionFailed();
        }
      );
  }

  public returnToMenu(): void {
    this.dialogRef.close({ action: 'return_to_menu' });
  }

  public getNextRetryText(): string {
    if (this.reconnectionStatus.nextRetryIn > 0) {
      const seconds = Math.ceil(this.reconnectionStatus.nextRetryIn / 1000);
      return `Next attempt in ${seconds}s`;
    }
    return 'Attempting to reconnect...';
  }

  public getErrorMessage(): string {
    if (!this.reconnectionStatus.error) {
      return '';
    }

    // Provide user-friendly error messages
    const error = this.reconnectionStatus.error.toLowerCase();

    if (error.includes('timeout') || error.includes('exceeded')) {
      return 'Connection timeout. The game may have ended or your session expired.';
    }

    if (error.includes('network') || error.includes('connection')) {
      return 'Network connection failed. Please check your internet connection.';
    }

    if (error.includes('server')) {
      return 'Server connection failed. The server may be temporarily unavailable.';
    }

    if (error.includes('maximum') || error.includes('attempts')) {
      return 'Unable to reconnect after multiple attempts. Please try again manually.';
    }

    // Default user-friendly message
    return 'Connection failed. Please check your internet connection and try again.';
  }

  public shouldShowRetryButton(): boolean {
    return this.showManualOptions && !this.isManualReconnecting;
  }

  public shouldShowProgressBar(): boolean {
    return this.reconnectionStatus.isReconnecting && !this.showManualOptions;
  }

  public getProgressPercentage(): number {
    if (this.reconnectionStatus.maxAttempts === 0) {
      return 0;
    }
    return (this.reconnectionStatus.currentAttempt / this.reconnectionStatus.maxAttempts) * 100;
  }

  private handleReconnectionSuccess(): void {
    this.dialogRef.close({ action: 'reconnected' });
  }

  private handleManualReconnectionFailed(): void {
    this.isManualReconnecting = false;
    this.showManualOptions = true;
    this.reconnectionStatus.error = 'Manual reconnection failed. Please check your connection.';
  }
}