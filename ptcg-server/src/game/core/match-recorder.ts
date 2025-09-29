import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Client } from '../client/client.interface';
import { Core } from './core';
import { State, GamePhase, GameWinner } from '../store/state/state';
import { User, Match } from '../../storage';
import { RankingCalculator } from './ranking-calculator';
import { Replay } from './replay';
import { ReplayPlayer } from './replay.interface';

export class MatchRecorder {

  private finished: boolean = false;
  private client1: Client | undefined;
  private client2: Client | undefined;
  private ranking: RankingCalculator;
  private replay: Replay;
  private transactionTimeout: NodeJS.Timeout | undefined;
  private readonly TRANSACTION_TIMEOUT_MS = 30000; // 30 seconds

  constructor(private core: Core) {
    this.ranking = new RankingCalculator();
    this.replay = new Replay({ indexEnabled: false });
  }

  public onStateChange(state: State) {
    if (this.finished) {
      return;
    }

    if (state.players.length >= 2) {
      this.updateClients(state);
    }

    if (state.phase !== GamePhase.WAITING_FOR_PLAYERS) {
      this.replay.appendState(state);
    }

    if (state.phase === GamePhase.FINISHED) {
      this.finished = true;
      if (state.winner !== GameWinner.NONE) {
        this.saveMatch(state);
      } else {
        this.cleanup();
      }
    }
  }

  @Transaction()
  private async saveMatch(state: State, @TransactionManager() manager?: EntityManager) {
    if (!this.client1 || !this.client2 || manager === undefined) {
      this.cleanup();
      return;
    }

    try {
      // Set transaction timeout
      this.transactionTimeout = setTimeout(() => {
        console.error('[MatchRecorder] Transaction timeout after', this.TRANSACTION_TIMEOUT_MS, 'ms');
        this.cleanup();
      }, this.TRANSACTION_TIMEOUT_MS);

      const match = new Match();
      match.player1 = this.client1.user;
      match.player2 = this.client2.user;
      match.winner = state.winner;
      match.created = Date.now();
      match.ranking1 = match.player1.ranking;
      match.ranking2 = match.player2.ranking;
      match.rankingStake1 = 0;
      match.rankingStake2 = 0;

      // Store archetype information based on deck analysis
      match.player1Archetype = this.getPlayerArchetype(state.players[0]);
      match.player2Archetype = this.getPlayerArchetype(state.players[1]);
      match.player1DeckName = `Deck ${match.player1.id}`;
      match.player2DeckName = `Deck ${match.player2.id}`;
      match.player1DeckId = null; // Will be populated later when we have deck ID tracking
      match.player2DeckId = null; // Will be populated later when we have deck ID tracking

      this.replay.setCreated(match.created);
      this.replay.player1 = this.buildReplayPlayer(match.player1);
      this.replay.player2 = this.buildReplayPlayer(match.player2);
      this.replay.winner = match.winner;
      match.replayData = this.replay.serialize();

      // Update ranking
      const users = this.ranking.calculateMatch(match, state);

      // Update match's ranking
      if (users.length >= 2) {
        match.rankingStake1 = users[0].ranking - match.ranking1;
        match.ranking1 = users[0].ranking;
        match.rankingStake2 = users[1].ranking - match.ranking2;
        match.ranking2 = users[1].ranking;
      }

      await manager.save(match);

      if (users.length >= 2) {
        for (const user of users) {
          const update = { ranking: user.ranking, lastRankingChange: user.lastRankingChange };
          await manager.update(User, user.id, update);
        }
        this.core.emit(c => c.onUsersUpdate(users));
      }

    } catch (error) {
      console.error('[MatchRecorder] Error saving match:', error);
    } finally {
      if (this.transactionTimeout) {
        clearTimeout(this.transactionTimeout);
      }
      this.cleanup();
    }
  }

  public cleanup(): void {
    this.finished = true;
    this.client1 = undefined;
    this.client2 = undefined;
    if (this.transactionTimeout) {
      clearTimeout(this.transactionTimeout);
      this.transactionTimeout = undefined;
    }
    this.replay = new Replay({ indexEnabled: false });
  }

  private updateClients(state: State) {
    const player1Id = state.players[0].id;
    const player2Id = state.players[1].id;
    if (this.client1 === undefined) {
      this.client1 = this.findClient(player1Id);
    }
    if (this.client2 === undefined) {
      this.client2 = this.findClient(player2Id);
    }
  }

  private findClient(clientId: number): Client | undefined {
    return this.core.clients.find(c => c.id === clientId);
  }

  private buildReplayPlayer(player: User): ReplayPlayer {
    return { userId: player.id, name: player.name, ranking: player.ranking };
  }

  private getPlayerArchetype(player: any): string {
    // Analyze the player's deck to determine archetype
    // For now, we'll use a simple approach based on the most common Pokemon in the deck
    const deckCards = player.deck.cards || [];

    if (deckCards.length === 0) {
      return 'UNKNOWN';
    }

    // Count Pokemon cards and their types
    const pokemonCounts: { [name: string]: number } = {};
    const typeCounts: { [type: string]: number } = {};

    deckCards.forEach((card: any) => {
      if (card && card.name) {
        // Count Pokemon cards - check if cardType is a string or enum
        const isPokemon = card.cardType && (
          (typeof card.cardType === 'string' && card.cardType.includes('POKEMON')) ||
          (typeof card.cardType === 'number' && card.cardType === 1) // Assuming 1 = POKEMON
        );

        if (isPokemon) {
          pokemonCounts[card.name] = (pokemonCounts[card.name] || 0) + 1;

          // Count by Pokemon type for archetype detection
          if (card.name.includes('Pikachu')) {
            typeCounts['Pikachu'] = (typeCounts['Pikachu'] || 0) + 1;
          } else if (card.name.includes('Charizard')) {
            typeCounts['Charizard'] = (typeCounts['Charizard'] || 0) + 1;
          } else if (card.name.includes('Arceus')) {
            typeCounts['Arceus'] = (typeCounts['Arceus'] || 0) + 1;
          } else if (card.name.includes('Giratina')) {
            typeCounts['Giratina'] = (typeCounts['Giratina'] || 0) + 1;
          } else if (card.name.includes('Comfey')) {
            typeCounts['Comfey'] = (typeCounts['Comfey'] || 0) + 1;
          } else if (card.name.includes('Raging Bolt')) {
            typeCounts['Raging Bolt'] = (typeCounts['Raging Bolt'] || 0) + 1;
          } else if (card.name.includes('Pidgeot')) {
            typeCounts['Pidgeot'] = (typeCounts['Pidgeot'] || 0) + 1;
          }
        }
      }
    });

    // Determine archetype based on most common Pokemon
    let maxCount = 0;
    let archetype = 'UNKNOWN';

    for (const [pokemon, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        archetype = pokemon.toUpperCase().replace(/\s+/g, '_');
      }
    }

    // Fallback to common archetypes if no specific Pokemon found
    if (archetype === 'UNKNOWN') {
      const commonArchetypes = ['PIKACHU', 'CHARIZARD', 'ARCEUS', 'GIRATINA', 'COMFEY'];
      const randomIndex = Math.floor(Math.random() * commonArchetypes.length);
      archetype = commonArchetypes[randomIndex];
    }

    return archetype;
  }

}
