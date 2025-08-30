import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { of } from 'rxjs';

// Mock Socket.IO
const mockSocket = {
  connected: false,
  connect: jasmine.createSpy('connect'),
  disconnect: jasmine.createSpy('disconnect'),
  emit: jasmine.createSpy('emit'),
  on: jasmine.createSpy('on'),
  off: jasmine.createSpy('off'),
  io: {
    opts: {
      query: {}
    }
  }
};

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService]
    });

    // Mock the socket.io-client module
    spyOn(require('socket.io-client'), 'io').and.returnValue(mockSocket);

    service = TestBed.inject(SocketService);

    // Reset mocks
    mockSocket.connected = false;
    mockSocket.connect.calls.reset();
    mockSocket.disconnect.calls.reset();
    mockSocket.emit.calls.reset();
    mockSocket.on.calls.reset();
    mockSocket.off.calls.reset();
  });

  describe('Reconnection Logic', () => {
    it('should initialize with default reconnection config', () => {
      expect(service['reconnectionConfig']).toEqual({
        maxAutoReconnectAttempts: 3,
        reconnectIntervals: [5000, 10000, 15000],
        preservationTimeoutMs: 5 * 60 * 1000
      });
    });

    it('should update reconnection config', () => {
      const newConfig = {
        maxAutoReconnectAttempts: 5,
        reconnectIntervals: [2000, 4000, 8000]
      };

      service.updateReconnectionConfig(newConfig);

      expect(service['reconnectionConfig'].maxAutoReconnectAttempts).toBe(5);
      expect(service['reconnectionConfig'].reconnectIntervals).toEqual([2000, 4000, 8000]);
      expect(service['reconnectionConfig'].preservationTimeoutMs).toBe(5 * 60 * 1000);
    });

    it('should start custom reconnection logic on disconnect', () => {
      service['wasConnectedBefore'] = true;
      service['enabled'] = true;

      spyOn(service as any, 'startCustomReconnectionLogic');

      service['handleDisconnect']('transport close');

      expect(service['startCustomReconnectionLogic']).toHaveBeenCalledWith('transport close');
    });

    it('should not start reconnection for server disconnect', () => {
      service['wasConnectedBefore'] = true;
      service['enabled'] = true;

      spyOn(service as any, 'startCustomReconnectionLogic');

      service['handleDisconnect']('io server disconnect');

      expect(service['startCustomReconnectionLogic']).not.toHaveBeenCalled();
    });

    it('should handle successful reconnection', () => {
      service['reconnectionStatus'].isReconnecting = true;
      service['lastKnownGameId'] = 123;

      spyOn(service, 'emit').and.returnValue(of({}));

      service['handleSuccessfulReconnection']();

      expect(service['reconnectionStatus'].isReconnecting).toBe(false);
      expect(service.emit).toHaveBeenCalledWith('game:rejoin', { gameId: 123 });
    });

    it('should stop reconnection attempts when max attempts reached', () => {
      service['reconnectionStatus'] = {
        isReconnecting: true,
        currentAttempt: 3,
        maxAttempts: 3,
        nextRetryIn: 0,
        lastDisconnectTime: Date.now()
      };

      spyOn(service as any, 'handleReconnectionFailure');

      service['attemptReconnection']();

      expect(service['handleReconnectionFailure']).toHaveBeenCalledWith('Maximum reconnection attempts reached');
    });

    it('should stop reconnection when preservation timeout exceeded', () => {
      const oldTime = Date.now() - (6 * 60 * 1000); // 6 minutes ago
      service['reconnectionStatus'] = {
        isReconnecting: true,
        currentAttempt: 1,
        maxAttempts: 3,
        nextRetryIn: 0,
        lastDisconnectTime: oldTime
      };

      spyOn(service as any, 'handleReconnectionFailure');

      service['attemptReconnection']();

      expect(service['handleReconnectionFailure']).toHaveBeenCalledWith('Reconnection timeout exceeded');
    });
  });

  describe('Manual Reconnection', () => {
    it('should return true if already connected', (done) => {
      mockSocket.connected = true;

      service.manualReconnect().subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should attempt manual reconnection when disconnected', () => {
      mockSocket.connected = false;

      service.manualReconnect().subscribe();

      expect(mockSocket.connect).toHaveBeenCalled();
    });
  });

  describe('Game ID Tracking', () => {
    it('should set and clear game ID', () => {
      service.setGameId(123);
      expect(service['lastKnownGameId']).toBe(123);

      service.clearGameId();
      expect(service['lastKnownGameId']).toBeUndefined();
    });

    it('should clear game ID on disable', () => {
      service.setGameId(123);
      service.disable();
      expect(service['lastKnownGameId']).toBeUndefined();
    });
  });

  describe('Reconnection Status', () => {
    it('should provide reconnection status observable', (done) => {
      service.reconnectionStatus$.subscribe(status => {
        expect(status).toEqual({
          isReconnecting: false,
          currentAttempt: 0,
          maxAttempts: 3,
          nextRetryIn: 0,
          lastDisconnectTime: 0
        });
        done();
      });
    });
  });
});