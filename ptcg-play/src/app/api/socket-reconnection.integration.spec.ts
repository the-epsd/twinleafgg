import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { SocketService } from './socket.service';
import { ReconnectionDialogService } from '../shared/services/reconnection-dialog.service';

describe('Socket Reconnection Integration', () => {
  let socketService: SocketService;
  let reconnectionDialogService: ReconnectionDialogService;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        SocketService,
        ReconnectionDialogService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter }
      ]
    });

    socketService = TestBed.inject(SocketService);
    reconnectionDialogService = TestBed.inject(ReconnectionDialogService);
  });

  it('should integrate reconnection flow between SocketService and ReconnectionDialogService', (done) => {
    let eventCount = 0;

    // Mock dialog
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialogRef.afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(null));
    mockDialog.open.and.returnValue(mockDialogRef);

    // Subscribe to reconnection events
    socketService.reconnectionEvents$.subscribe(event => {
      eventCount++;

      if (eventCount === 1) {
        expect(event.type).toBe('attempting');
        expect(event.attempt).toBe(1);

        // Verify dialog was opened
        expect(mockDialog.open).toHaveBeenCalled();
        done();
      }
    });

    // Simulate disconnection
    socketService['wasConnectedBefore'] = true;
    socketService['enabled'] = true;
    socketService['handleDisconnect']('transport close');
  });

  it('should handle game ID tracking during reconnection', () => {
    const gameId = 123;

    socketService.setGameId(gameId);
    expect(socketService['lastKnownGameId']).toBe(gameId);

    // Mock successful reconnection
    spyOn(socketService, 'emit').and.returnValue(of({}));

    socketService['handleSuccessfulReconnection']();

    expect(socketService.emit).toHaveBeenCalledWith('game:rejoin', { gameId: gameId });
  });

  it('should update reconnection config and apply to status', () => {
    const newConfig = {
      maxAutoReconnectAttempts: 5,
      reconnectIntervals: [1000, 2000, 3000]
    };

    socketService.updateReconnectionConfig(newConfig);

    expect(socketService['reconnectionConfig'].maxAutoReconnectAttempts).toBe(5);
    expect(socketService['reconnectionStatus'].maxAttempts).toBe(5);
  });

  it('should provide correct reconnection status observables', (done) => {
    let statusReceived = false;
    let eventsReceived = false;

    socketService.reconnectionStatus$.subscribe(status => {
      expect(status).toBeDefined();
      expect(status.isReconnecting).toBe(false);
      statusReceived = true;

      if (statusReceived && eventsReceived) {
        done();
      }
    });

    socketService.reconnectionEvents$.subscribe(event => {
      // This will be called when events are emitted
      eventsReceived = true;

      if (statusReceived && eventsReceived) {
        done();
      }
    });

    // Trigger an event to test the observable
    socketService['reconnectionEventSubject'].next({ type: 'attempting', attempt: 1 });
  });
});