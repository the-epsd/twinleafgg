import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ConnectionStatusComponent } from './connection-status.component';
import { SocketService } from '../../../api/socket.service';
import { MaterialModule } from '../../material.module';

describe('ConnectionStatusComponent', () => {
  let component: ConnectionStatusComponent;
  let fixture: ComponentFixture<ConnectionStatusComponent>;
  let mockSocketService: jasmine.SpyObj<SocketService>;
  let connectionSubject: Subject<boolean>;
  let reconnectionStatusSubject: Subject<any>;

  beforeEach(async () => {
    connectionSubject = new Subject();
    reconnectionStatusSubject = new Subject();

    mockSocketService = jasmine.createSpyObj('SocketService', [], {
      connection: connectionSubject.asObservable(),
      reconnectionStatus$: reconnectionStatusSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [ConnectionStatusComponent],
      imports: [MaterialModule],
      providers: [
        { provide: SocketService, useValue: mockSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update connection status from service', () => {
    component.ngOnInit();

    connectionSubject.next(true);
    expect(component.isConnected).toBe(true);

    connectionSubject.next(false);
    expect(component.isConnected).toBe(false);
  });

  it('should update reconnection status from service', () => {
    const mockStatus = {
      isReconnecting: true,
      currentAttempt: 2,
      maxAttempts: 3,
      nextRetryIn: 5000
    };

    component.ngOnInit();
    reconnectionStatusSubject.next(mockStatus);

    expect(component.reconnectionStatus).toEqual(mockStatus);
  });

  it('should return correct connection status text when connected', () => {
    component.isConnected = true;
    expect(component.getConnectionStatusText()).toBe('Connected');
  });

  it('should return correct connection status text when reconnecting', () => {
    component.isConnected = false;
    component.reconnectionStatus = {
      isReconnecting: true,
      currentAttempt: 2,
      maxAttempts: 3
    };

    expect(component.getConnectionStatusText()).toBe('Reconnecting... (2/3)');
  });

  it('should return correct connection status text when disconnected', () => {
    component.isConnected = false;
    component.reconnectionStatus = {
      isReconnecting: false,
      currentAttempt: 0,
      maxAttempts: 3
    };

    expect(component.getConnectionStatusText()).toBe('Disconnected');
  });

  it('should return correct connection status class', () => {
    component.isConnected = true;
    expect(component.getConnectionStatusClass()).toBe('connected');

    component.isConnected = false;
    component.reconnectionStatus = { isReconnecting: true };
    expect(component.getConnectionStatusClass()).toBe('reconnecting');

    component.reconnectionStatus = { isReconnecting: false };
    expect(component.getConnectionStatusClass()).toBe('disconnected');
  });

  it('should show status only when disconnected or reconnecting', () => {
    component.isConnected = true;
    component.reconnectionStatus = { isReconnecting: false };
    expect(component.shouldShowStatus()).toBe(false);

    component.isConnected = false;
    expect(component.shouldShowStatus()).toBe(true);

    component.isConnected = true;
    component.reconnectionStatus = { isReconnecting: true };
    expect(component.shouldShowStatus()).toBe(true);
  });

  it('should return next retry text correctly', () => {
    component.reconnectionStatus.nextRetryIn = 5500;
    expect(component.getNextRetryText()).toBe('- 6s');

    component.reconnectionStatus.nextRetryIn = 0;
    expect(component.getNextRetryText()).toBe('');
  });

  it('should return connection quality correctly', () => {
    component.isConnected = true;
    expect(component.getConnectionQuality()).toBe('Good');

    component.isConnected = false;
    component.reconnectionStatus = { isReconnecting: true };
    expect(component.getConnectionQuality()).toBe('Poor');

    component.reconnectionStatus = { isReconnecting: false };
    expect(component.getConnectionQuality()).toBe('None');
  });

  it('should show tooltip when not connected', () => {
    component.isConnected = false;
    expect(component.shouldShowTooltip()).toBe(true);

    component.isConnected = true;
    expect(component.shouldShowTooltip()).toBe(false);
  });

  it('should return appropriate tooltip text', () => {
    component.reconnectionStatus = { isReconnecting: true };
    expect(component.getTooltipText()).toContain('Attempting to reconnect');

    component.isConnected = false;
    component.reconnectionStatus = { isReconnecting: false };
    expect(component.getTooltipText()).toContain('Connection lost');

    component.isConnected = true;
    expect(component.getTooltipText()).toBe('');
  });
});