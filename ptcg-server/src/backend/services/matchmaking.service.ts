// import { Format, GameSettings, Rules } from '../../game';
// import { Core } from '../../game/core/core';
// import { Client } from '../../game/client/client.interface';
// import { SocketWrapper } from '../socket/socket-wrapper';

// interface QueuedPlayer {
//   client: Client;
//   socketWrapper: SocketWrapper;
//   format: Format;
//   deck: string[];
//   joinedAt: number;
// }

// export class MatchmakingService {
//   private static instance: MatchmakingService;
//   private queue: QueuedPlayer[] = [];
//   private matchCheckInterval: NodeJS.Timeout;

//   private constructor(private core: Core) {
//     this.matchCheckInterval = setInterval(() => this.checkMatches(), 2000);
//   }

//   public static getInstance(core: Core): MatchmakingService {
//     if (!MatchmakingService.instance) {
//       MatchmakingService.instance = new MatchmakingService(core);
//     }
//     return MatchmakingService.instance;
//   }

//   public addToQueue(client: Client, socketWrapper: SocketWrapper, format: Format, deck: string[]): void {
//     // Remove if already in queue
//     this.removeFromQueue(client);

//     this.queue.push({
//       client,
//       socketWrapper,
//       format,
//       deck,
//       joinedAt: Date.now()
//     });

//     this.broadcastQueueUpdate();
//   }

//   public removeFromQueue(client: Client): void {
//     this.queue = this.queue.filter(p => p.client !== client);
//     this.broadcastQueueUpdate();
//   }

//   public getQueuedPlayers(): string[] {
//     return this.queue.map(p => p.client.name);
//   }

//   private broadcastQueueUpdate(): void {
//     const players = this.getQueuedPlayers();
//     this.queue.forEach(p => {
//       p.socketWrapper.emit('matchmaking:queueUpdate', { players });
//     });
//   }

//   private checkMatches(): void {
//     if (this.queue.length < 2) return;

//     // Group players by format
//     const formatGroups = new Map<Format, QueuedPlayer[]>();
//     this.queue.forEach(player => {
//       const players = formatGroups.get(player.format) || [];
//       players.push(player);
//       formatGroups.set(player.format, players);
//     });

//     // Check each format group for potential matches
//     formatGroups.forEach(players => {
//       if (players.length < 2) return;

//       // Sort by time in queue
//       players.sort((a, b) => a.joinedAt - b.joinedAt);

//       // Match first two players
//       const player1 = players[0];
//       const player2 = players[1];

//       // Create game settings
//       const gameSettings: GameSettings = {
//         format: player1.format,
//         timeLimit: 1800,
//         rules: new Rules(),
//         recordingEnabled: false
//       };

//       // Use createGameWithDecks instead of createGame
//       const game = this.core.createGameWithDecks(
//         player1.client,
//         player1.deck,
//         gameSettings,
//         player2.client,
//         player2.deck
//       );

//       if (game) {
//         // Notify players
//         player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
//         player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });

//         // Remove matched players from queue
//         this.removeFromQueue(player1.client);
//         this.removeFromQueue(player2.client);
//       }
//     });
//   }

//   public dispose(): void {
//     if (this.matchCheckInterval) {
//       clearInterval(this.matchCheckInterval);
//     }
//   }
// }