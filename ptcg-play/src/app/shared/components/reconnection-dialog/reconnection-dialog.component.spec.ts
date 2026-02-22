import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { of, Subject } from 'rxjs';

import { ReconnectionDialogComponent } from './reconnection-dialog.component';
import { SocketService } from '../../../api/socket.service';
import { MaterialModule } from '../../material.module';

describe('ReconnectionDialogComponent', () => {
  let component: ReconnectionDialogComponent;
  let fixture: ComponentFixture<ReconnectionDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ReconnectionDialogComponent>>;
  let mockSocketService: jasmine.SpyObj<SocketService>;
  let reconnectionStatusSubject: Subject<any>;
  let reconnectionEventsSubject: Subject<any>;

  beforeEach(async () => {
    reconnectionStatusSubject = new Subject();
    reconnectionEventsSubject = new Subject();

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialogRef.disableClose = false;

    mockSocketService = jasmine.createSpyObj('SocketService', ['manualReconnect'], {
      reconnectionStatus$: reconnectionStatusSubject.asObservable(),
      reconnectionEvents$: reconnectionEventsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [ReconnectionDialogComponent],
      imports: [MaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SocketService, useValue: mockSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReconnectionDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable dialog close on init', () => {
    component.ngOnInit();
    expect(mockDialogRef.disableClose).toBe(true);
  });

  it('should update reconnection status from service', () => {
    const mockStatus = {
      isReconnecting: true,
      currentAttempt: 2,
      maxAttempts: 3,
      nextRetryIn: 5000,
      error: ''
    };

    component.ngOnInit();
    reconnectionStatusSubject.next(mockStatus);

    expect(component.reconnectionStatus).toEqual(mockStatus);
  });

  it('should handle successful reconnection event', () => {
    component.ngOnInit();

    reconnectionEventsSubject.next({ type: 'success' });

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'reconnected' });
  });

  it('should show manual options on failed reconnection', () => {
    component.ngOnInit();

    reconnectionEventsSubject.next({ type: 'failed', error: 'Connection failed' });

    expect(component.showManualOptions).toBe(true);
  });

  it('should show manual options when manual reconnection required', () => {
    component.ngOnInit();

    reconnectionEventsSubject.next({ type: 'manual_required' });

    expect(component.showManualOptions).toBe(true);
  });

  it('should handle manual reconnection success', () => {
    mockSocketService.manualReconnect.and.returnValue(of(true));

    component.manualReconnect();

    expect(component.isManualReconnecting).toBe(true);
    expect(component.showManualOptions).toBe(false);
    expect(mockSocketService.manualReconnect).toHaveBeenCalled();
  });

  it('should handle manual reconnection failure', () => {
    mockSocketService.manualReconnect.and.returnValue(of(false));

    component.manualReconnect();

    // Wait for async operation
    setTimeout(() => {
      expect(component.isManualReconnecting).toBe(false);
      expect(component.showManualOptions).toBe(true);
      expect(component.reconnectionStatus.error).toContain('Manual reconnection failed');
    });
  });

  it('should return to menu when requested', () => {
    component.returnToMenu();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'return_to_menu' });
  });

  it('should calculate next retry text correctly', () => {
    component.reconnectionStatus.nextRetryIn = 5500;
    expect(component.getNextRetryText()).toBe('Next attempt in 6s');

    component.reconnectionStatus.nextRetryIn = 0;
    expect(component.getNextRetryText()).toBe('Attempting to reconnect...');
  });

  it('should calculate progress percentage correctly', () => {
    component.reconnectionStatus.currentAttempt = 2;
    component.reconnectionStatus.maxAttempts = 4;

    expect(component.getProgressPercentage()).toBe(50);

    component.reconnectionStatus.maxAttempts = 0;
    expect(component.getProgressPercentage()).toBe(0);
  });

  it('should return user-friendly error messages', () => {
    component.reconnectionStatus.error = 'Connection timeout exceeded';
    expect(component.getErrorMessage()).toContain('timeout');

    component.reconnectionStatus.error = 'Network connection failed';
    expect(component.getErrorMessage()).toContain('Network connection failed');

    component.reconnectionStatus.error = 'Server error occurred';
    expect(component.getErrorMessage()).toContain('Server connection failed');

    component.reconnectionStatus.error = 'Maximum attempts reached';
    expect(component.getErrorMessage()).toContain('Unable to reconnect');

    component.reconnectionStatus.error = 'Unknown error';
    expect(component.getErrorMessage()).toContain('Connection failed');

    component.reconnectionStatus.error = '';
    expect(component.getErrorMessage()).toBe('');
  });

  it('should determine when to show retry button', () => {
    component.showManualOptions = true;
    component.isManualReconnecting = false;
    expect(component.shouldShowRetryButton()).toBe(true);

    component.showManualOptions = false;
    expect(component.shouldShowRetryButton()).toBe(false);

    component.showManualOptions = true;
    component.isManualReconnecting = true;
    expect(component.shouldShowRetryButton()).toBe(false);
  });

  it('should determine when to show progress bar', () => {
    component.reconnectionStatus.isReconnecting = true;
    component.showManualOptions = false;
    expect(component.shouldShowProgressBar()).toBe(true);

    component.reconnectionStatus.isReconnecting = false;
    expect(component.shouldShowProgressBar()).toBe(false);

    component.reconnectionStatus.isReconnecting = true;
    component.showManualOptions = true;
    expect(component.shouldShowProgressBar()).toBe(false);
  });

  it('should show manual options immediately if specified in data', () => {
    component.data.showManualOptions = true;
    component.ngOnInit();

    expect(component.showManualOptions).toBe(true);
  });
});