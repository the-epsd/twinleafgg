import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';

import { ReconnectionDialogService } from '../services/reconnection-dialog.service';
import { SocketService } from '../../api/socket.service';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { MaterialModule } from '../material.module';

describe('Reconnection Integration', () => {
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSocketService: jasmine.SpyObj<SocketService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let reconnectionDialogService: ReconnectionDialogService;
  let connectionStatusComponent: ConnectionStatusComponent;
  let connectionStatusFixture: ComponentFixture<ConnectionStatusComponent>;
  let reconnectionEventsSubject: Subject<any>;
  let connectionSubject: Subject<boolean>;
  let reconnectionStatusSubject: Subject<any>;

  beforeEach(async () => {
    reconnectionEventsSubject = new Subject();
    connectionSubject = new Subject();
    reconnectionStatusSubject = new Subject();

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSocketService = jasmine.createSpyObj('SocketService', ['clearGameId'], {
      reconnectionEvents$: reconnectionEventsSubject.asObservable(),
      connection: connectionSubject.asObservable(),
      reconnectionStatus$: reconnectionStatusSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [ConnectionStatusComponent],
      imports: [MaterialModule],
      providers: [
        ReconnectionDialogService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: SocketService, useValue: mockSocketService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    reconnectionDialogService = TestBed.inject(ReconnectionDialogService);
    connectionStatusFixture = TestBed.createComponent(ConnectionStatusComponent);
    connectionStatusComponent = connectionStatusFixture.componentInstance;
  });

  it('should integrate connection status with reconnection dialog service', () => {
    // Initialize connection status component
    connectionStatusComponent.ngOnInit();

    // Simulate disconnection
    connectionSubject.next(false);
    reconnectionStatusSubject.next({
      isReconnecting: true,
      currentAttempt: 1,
      maxAttempts: 3,
      nextRetryIn: 5000
    });

    // Verify connection status updates
    expect(connectionStatusComponent.isConnected).toBe(false);
    expect(connectionStatusComponent.reconnectionStatus.isReconnecting).toBe(true);
    expect(connectionStatusComponent.shouldShowStatus()).toBe(true);
    expect(connectionStatusComponent.getConnectionStatusClass()).toBe('reconnecting');
  });

  it('should show dialog on first reconnection attempt', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialogRef.afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(null));
    mockDialog.open.and.returnValue(mockDialogRef);

    // Trigger first reconnection attempt
    reconnectionEventsSubject.next({ type: 'attempting', attempt: 1 });

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle successful reconnection', () => {
    connectionStatusComponent.ngOnInit();

    // Simulate successful reconnection
    connectionSubject.next(true);
    reconnectionStatusSubject.next({
      isReconnecting: false,
      currentAttempt: 0,
      maxAttempts: 3,
      nextRetryIn: 0
    });

    expect(connectionStatusComponent.isConnected).toBe(true);
    expect(connectionStatusComponent.shouldShowStatus()).toBe(false);
  });

  it('should provide user-friendly status messages', () => {
    connectionStatusComponent.ngOnInit();

    // Test different connection states
    connectionStatusComponent.isConnected = true;
    expect(connectionStatusComponent.getConnectionStatusText()).toBe('Connected');

    connectionStatusComponent.isConnected = false;
    connectionStatusComponent.reconnectionStatus = {
      isReconnecting: true,
      currentAttempt: 2,
      maxAttempts: 3,
      nextRetryIn: 5000
    };

    const statusText = connectionStatusComponent.getConnectionStatusText();
    expect(statusText).toContain('Reconnecting');
    expect(statusText).toContain('2/3');
    expect(statusText).toContain('5s');
  });

  it('should handle connection quality indicators', () => {
    connectionStatusComponent.isConnected = true;
    expect(connectionStatusComponent.getConnectionQuality()).toBe('Good');

    connectionStatusComponent.isConnected = false;
    connectionStatusComponent.reconnectionStatus = { isReconnecting: true };
    expect(connectionStatusComponent.getConnectionQuality()).toBe('Poor');

    connectionStatusComponent.reconnectionStatus = { isReconnecting: false };
    expect(connectionStatusComponent.getConnectionQuality()).toBe('None');
  });
});