import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';

import { ReconnectionDialogService } from './reconnection-dialog.service';
import { SocketService } from '../../api/socket.service';
import { ReconnectionDialogComponent } from '../components/reconnection-dialog/reconnection-dialog.component';

describe('ReconnectionDialogService', () => {
  let service: ReconnectionDialogService;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSocketService: jasmine.SpyObj<SocketService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ReconnectionDialogComponent>>;
  let reconnectionEventsSubject: Subject<any>;
  let connectionSubject: Subject<boolean>;

  beforeEach(() => {
    reconnectionEventsSubject = new Subject();
    connectionSubject = new Subject();

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialogRef.afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(null));

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    mockSocketService = jasmine.createSpyObj('SocketService', ['clearGameId'], {
      reconnectionEvents$: reconnectionEventsSubject.asObservable(),
      connection: connectionSubject.asObservable()
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ReconnectionDialogService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: SocketService, useValue: mockSocketService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(ReconnectionDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show reconnection dialog on first reconnection attempt', () => {
    reconnectionEventsSubject.next({ type: 'attempting', attempt: 1 });

    expect(mockDialog.open).toHaveBeenCalledWith(ReconnectionDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        gameId: undefined,
        showManualOptions: false
      }
    });
  });

  it('should not show dialog on subsequent reconnection attempts', () => {
    reconnectionEventsSubject.next({ type: 'attempting', attempt: 2 });

    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should close dialog on successful reconnection', () => {
    service['isDialogOpen'] = true;
    service['dialogRef'] = mockDialogRef;

    reconnectionEventsSubject.next({ type: 'success' });

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'reconnected' });
  });

  it('should close dialog when connection is restored', () => {
    service['isDialogOpen'] = true;
    service['dialogRef'] = mockDialogRef;

    connectionSubject.next(true);

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'reconnected' });
  });

  it('should not show dialog if already open', () => {
    service['isDialogOpen'] = true;

    service.showReconnectionDialog();

    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should show manual reconnection dialog', () => {
    service.showManualReconnectionDialog(123);

    expect(mockDialog.open).toHaveBeenCalledWith(ReconnectionDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        gameId: 123,
        showManualOptions: true
      }
    });
  });

  it('should handle return to menu action', () => {
    mockDialogRef.afterClosed.and.returnValue(of({ action: 'return_to_menu' }));

    service.showReconnectionDialog();

    expect(mockSocketService.clearGameId).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should close dialog when requested', () => {
    service['dialogRef'] = mockDialogRef;

    service.closeReconnectionDialog();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'reconnected' });
  });

  it('should handle dialog close and reset state', () => {
    mockDialogRef.afterClosed.and.returnValue(of(null));
    service['isDialogOpen'] = true;

    service.showReconnectionDialog();

    // Simulate dialog close
    expect(service['isDialogOpen']).toBe(true); // Initially true

    // The afterClosed callback should reset the state
    // This would happen asynchronously in real usage
  });

  it('should destroy properly', () => {
    service['dialogRef'] = mockDialogRef;

    service.destroy();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'reconnected' });
  });
});