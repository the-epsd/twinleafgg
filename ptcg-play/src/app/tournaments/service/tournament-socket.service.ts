import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Tournament } from '../model/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    // Initialize socket connection with proper configuration
    this.socket = io('http://localhost:3000', {  // adjust URL to match your server
      path: '/api/socket',
      transports: ['websocket']
    });
  }

  joinTournament(tournamentId: number): void {
    this.socket.emit('tournament:join', tournamentId);
  }

  leaveTournament(tournamentId: number): void {
    this.socket.emit('tournament:leave', tournamentId);
  }

  onTournamentUpdate(): Observable<Tournament> {
    return new Observable(observer => {
      this.socket.on('tournament:update', (data: Tournament) => {
        observer.next(data);
      });
    });
  }

  onMatchUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('tournament:matchUpdate', (data: any) => {
        observer.next(data);
      });
    });
  }
}