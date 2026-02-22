import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { SocketService } from '../../api/socket.service';
import { ReconnectionDialogComponent } from '../components/reconnection-dialog/reconnection-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ReconnectionDialogService {

  private destroy$ = new Subject<void>();
  private dialogRef?: MatDialogRef<ReconnectionDialogComponent>;
  private isDialogOpen = false;

  constructor(
    private dialog: MatDialog,
    private socketService: SocketService,
    private router: Router
  ) {
    this.initializeReconnectionHandling();
  }

  private initializeReconnectionHandling(): void {
    // Listen for reconnection events
    this.socketService.reconnectionEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        switch (event.type) {
          case 'attempting':
            if (event.attempt === 1) {
              // Show dialog on first reconnection attempt
              this.showReconnectionDialog();
            }
            break;
          case 'success':
            this.closeReconnectionDialog();
            break;
          case 'failed':
          case 'manual_required':
            // Dialog will handle these events internally
            break;
        }
      });

    // Listen for connection status changes
    this.socketService.connection
      .pipe(
        takeUntil(this.destroy$),
        filter(connected => connected === true)
      )
      .subscribe(() => {
        // Connection restored, close dialog if open
        this.closeReconnectionDialog();
      });
  }

  public showReconnectionDialog(gameId?: number): void {
    if (this.isDialogOpen) {
      return;
    }

    this.isDialogOpen = true;
    this.dialogRef = this.dialog.open(ReconnectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'reconnection-backdrop',
      data: {
        gameId: gameId,
        showManualOptions: false
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      this.dialogRef = undefined;

      if (result?.action === 'return_to_menu') {
        this.handleReturnToMenu();
      }
    });
  }

  public showManualReconnectionDialog(gameId?: number): void {
    if (this.isDialogOpen) {
      return;
    }

    this.isDialogOpen = true;
    this.dialogRef = this.dialog.open(ReconnectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'reconnection-backdrop',
      data: {
        gameId: gameId,
        showManualOptions: true
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      this.dialogRef = undefined;

      if (result?.action === 'return_to_menu') {
        this.handleReturnToMenu();
      }
    });
  }

  public closeReconnectionDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close({ action: 'reconnected' });
    }
  }

  private handleReturnToMenu(): void {
    // Clear any game state and navigate to main menu
    this.socketService.clearGameId();
    this.router.navigate(['/']);
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeReconnectionDialog();
  }
}