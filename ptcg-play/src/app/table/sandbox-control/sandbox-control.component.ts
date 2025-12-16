import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Player, GamePhase, State } from 'ptcg-server';
import { SandboxService } from '../../api/services/sandbox.service';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-sandbox-control',
  templateUrl: './sandbox-control.component.html',
  styleUrls: ['./sandbox-control.component.scss']
})
export class SandboxControlComponent implements OnInit, OnChanges {

  @Input() gameId: number;
  @Input() gameState: State;
  @Input() players: Player[];
  @Input() clientId: number;

  public selectedPlayerIndex: number = 0;
  public selectedBenchIndex: number = 0;
  public cardName: string = '';
  public selectedCardIndex: number | null = null;
  public selectedCardIndices: Set<number> = new Set();
  public fromZone: string = 'hand';
  public toZone: string = 'hand';
  public prizeIndex: number = 0;
  public availableCards: string[] = [];
  public selectedEnergyType: string = '';

  // Player modifications
  public playerMods = {
    prizes: null as number | null,
    handSize: null as number | null,
    deckSize: null as number | null,
    discardSize: null as number | null,
    lostzoneSize: null as number | null,
    supporterTurn: null as number | null,
    retreatedTurn: null as number | null,
    energyPlayedTurn: null as number | null,
    stadiumPlayedTurn: null as number | null,
    stadiumUsedTurn: null as number | null,
    usedVSTAR: false,
    usedGX: false,
    ancientSupporter: false,
    rocketSupporter: false
  };

  // Game state modifications
  public gameStateMods = {
    turn: null as number | null,
    phase: null as GamePhase | null,
    activePlayer: null as number | null,
    skipOpponentTurn: false,
    isSuddenDeath: false,
    rules: {
      firstTurnDrawCard: true,
      firstTurnUseSupporter: true,
      attackFirstTurn: false,
      unlimitedEnergyAttachments: false,
      alternativeSetup: false
    }
  };

  // Pokemon modifications
  public pokemonMods = {
    damage: null as number | null,
    hp: null as number | null,
    energyCount: null as number | null,
    conditions: {
      burned: false,
      poisoned: false,
      asleep: false,
      paralyzed: false,
      confused: false
    }
  };

  public pokemonLocation: 'active' | 'bench' = 'active';

  public gamePhases = [
    { value: GamePhase.WAITING_FOR_PLAYERS, label: 'WAITING_FOR_PLAYERS' },
    { value: GamePhase.SETUP, label: 'SETUP' },
    { value: GamePhase.PLAYER_TURN, label: 'PLAYER_TURN' },
    { value: GamePhase.ATTACK, label: 'ATTACK' },
    { value: GamePhase.AFTER_ATTACK, label: 'AFTER_ATTACK' },
    { value: GamePhase.CHOOSE_PRIZES, label: 'CHOOSE_PRIZES' },
    { value: GamePhase.BETWEEN_TURNS, label: 'BETWEEN_TURNS' },
    { value: GamePhase.FINISHED, label: 'FINISHED' }
  ];

  constructor(
    private sandboxService: SandboxService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  public energyTypes = [
    'Fire Energy SVE 2',
    'Water Energy SVE 3',
    'Grass Energy SVE 1',
    'Lightning Energy SVE 4',
    'Psychic Energy SVE 5',
    'Fighting Energy SVE 6',
    'Darkness Energy SVE 7',
    'Metal Energy SVE 8',
    'Fairy Energy XY 140'
  ];

  ngOnInit() {
    if (this.gameState) {
      this.gameStateMods.turn = this.gameState.turn;
      this.gameStateMods.phase = this.gameState.phase;
      this.gameStateMods.activePlayer = this.gameState.activePlayer;
      this.gameStateMods.skipOpponentTurn = this.gameState.skipOpponentTurn;
      this.gameStateMods.isSuddenDeath = this.gameState.isSuddenDeath || false;
      if (this.gameState.rules) {
        this.gameStateMods.rules = { ...this.gameState.rules };
      }
    }
    this.onFromZoneChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    // When gameState changes (after sandbox action), refresh the cards list
    if (changes['gameState']) {
      if (!changes['gameState'].firstChange) {
        // State updated, refresh the cards list
        // Use setTimeout to ensure the state has fully propagated
        setTimeout(() => {
          this.refreshCardsList();
        }, 50);
      } else {
        // Initial load
        this.onFromZoneChange();
      }
    }
    // Also refresh when players change
    if (changes['players'] && !changes['players'].firstChange) {
      setTimeout(() => {
        this.refreshCardsList();
      }, 50);
    }
  }

  get selectedPlayer(): Player | undefined {
    // Always get the latest player from the current gameState
    if (!this.gameState || !this.gameState.players) {
      return this.players && this.players[this.selectedPlayerIndex];
    }
    // Use players from gameState (always the source of truth)
    if (this.selectedPlayerIndex < this.gameState.players.length) {
      return this.gameState.players[this.selectedPlayerIndex];
    }
    return undefined;
  }

  getCardsFromZone(zone: string): string[] {
    // Always use the latest gameState to get cards
    if (!this.gameState || !this.gameState.players) {
      return [];
    }

    // Get the player directly from gameState
    if (this.selectedPlayerIndex >= this.gameState.players.length) {
      return [];
    }

    const targetPlayer = this.gameState.players[this.selectedPlayerIndex];
    if (!targetPlayer) {
      return [];
    }

    // Get cards from the actual CardList objects
    switch (zone) {
      case 'hand':
        return targetPlayer.hand.cards.map(c => c.fullName);
      case 'deck':
        return targetPlayer.deck.cards.map(c => c.fullName);
      case 'discard':
        return targetPlayer.discard.cards.map(c => c.fullName);
      case 'lostzone':
        return targetPlayer.lostzone.cards.map(c => c.fullName);
      case 'stadium':
        return targetPlayer.stadium.cards.map(c => c.fullName);
      case 'supporter':
        return targetPlayer.supporter.cards.map(c => c.fullName);
      case 'prizes':
        const prizeCards: string[] = [];
        targetPlayer.prizes.forEach(prize => {
          prizeCards.push(...prize.cards.map(c => c.fullName));
        });
        return prizeCards;
      default:
        return [];
    }
  }

  onFromZoneChange() {
    // Force refresh by getting the latest game state
    if (this.gameState && this.selectedPlayer) {
      // Re-fetch cards from the current game state
      this.availableCards = this.getCardsFromZone(this.fromZone);
      this.selectedCardIndex = null;
      this.selectedCardIndices.clear();
      this.cardName = '';
    }
  }

  onCardSelected() {
    if (this.selectedCardIndex !== null && this.availableCards[this.selectedCardIndex]) {
      this.cardName = this.availableCards[this.selectedCardIndex];
    }
  }

  onCardCheckboxChange(index: number, checked: boolean) {
    if (checked) {
      this.selectedCardIndices.add(index);
    } else {
      this.selectedCardIndices.delete(index);
    }
  }

  isCardSelected(index: number): boolean {
    return this.selectedCardIndices.has(index);
  }

  onPlayerChange() {
    this.onFromZoneChange();
  }

  // Method to refresh cards list from current game state
  refreshCardsList() {
    if (this.gameState && this.selectedPlayer) {
      const oldCards = [...this.availableCards];
      this.availableCards = this.getCardsFromZone(this.fromZone);
      
      // Clear selections for cards that no longer exist
      const newSelectedIndices = new Set<number>();
      this.selectedCardIndices.forEach(oldIndex => {
        if (oldIndex < this.availableCards.length) {
          const oldCardName = oldCards[oldIndex];
          const newIndex = this.availableCards.findIndex(c => c === oldCardName);
          if (newIndex !== -1) {
            newSelectedIndices.add(newIndex);
          }
        }
      });
      this.selectedCardIndices = newSelectedIndices;
      
      // If the selected card is no longer available, clear selection
      if (this.selectedCardIndex !== null) {
        if (this.selectedCardIndex >= this.availableCards.length || 
            this.availableCards[this.selectedCardIndex] !== this.cardName) {
          this.selectedCardIndex = null;
          this.cardName = '';
        }
      }
    }
  }

  applyPlayerModifications() {
    if (!this.selectedPlayer) return;

    const mods: any = {};
    if (this.playerMods.prizes !== null) mods.prizes = this.playerMods.prizes;
    if (this.playerMods.handSize !== null) mods.handSize = this.playerMods.handSize;
    if (this.playerMods.deckSize !== null) mods.deckSize = this.playerMods.deckSize;
    if (this.playerMods.discardSize !== null) mods.discardSize = this.playerMods.discardSize;
    if (this.playerMods.lostzoneSize !== null) mods.lostzoneSize = this.playerMods.lostzoneSize;
    if (this.playerMods.supporterTurn !== null) mods.supporterTurn = this.playerMods.supporterTurn;
    if (this.playerMods.retreatedTurn !== null) mods.retreatedTurn = this.playerMods.retreatedTurn;
    if (this.playerMods.energyPlayedTurn !== null) mods.energyPlayedTurn = this.playerMods.energyPlayedTurn;
    if (this.playerMods.stadiumPlayedTurn !== null) mods.stadiumPlayedTurn = this.playerMods.stadiumPlayedTurn;
    if (this.playerMods.stadiumUsedTurn !== null) mods.stadiumUsedTurn = this.playerMods.stadiumUsedTurn;
    mods.usedVSTAR = this.playerMods.usedVSTAR;
    mods.usedGX = this.playerMods.usedGX;
    mods.ancientSupporter = this.playerMods.ancientSupporter;
    mods.rocketSupporter = this.playerMods.rocketSupporter;

    this.sandboxService.modifyPlayer(this.gameId, this.selectedPlayer.id, mods).subscribe(
      () => {
        this.alertService.toast(this.translate.instant('SANDBOX_PLAYER_MODIFIED'));
      },
      () => { }
    );
  }

  applyGameStateModifications() {
    const mods: any = {};
    if (this.gameStateMods.turn !== null) mods.turn = this.gameStateMods.turn;
    if (this.gameStateMods.phase !== null) mods.phase = this.gameStateMods.phase;
    if (this.gameStateMods.activePlayer !== null) mods.activePlayer = this.gameStateMods.activePlayer;
    mods.skipOpponentTurn = this.gameStateMods.skipOpponentTurn;
    mods.isSuddenDeath = this.gameStateMods.isSuddenDeath;
    mods.rules = this.gameStateMods.rules;

    this.sandboxService.modifyGameState(this.gameId, mods).subscribe(
      () => {
        this.alertService.toast(this.translate.instant('SANDBOX_GAME_STATE_MODIFIED'));
      },
      () => { }
    );
  }

  addCard() {
    if (!this.selectedPlayer || !this.cardName.trim()) return;

    this.sandboxService.modifyCard(
      this.gameId,
      this.selectedPlayer.id,
      'add',
      this.cardName.trim(),
      undefined,
      this.toZone
    ).subscribe(
      () => {
        this.alertService.toast(this.translate.instant('SANDBOX_CARD_ADDED'));
        this.cardName = '';
        this.selectedCardIndex = null;
        // Refresh the available cards list after a short delay to allow state to update
        setTimeout(() => {
          this.refreshCardsList();
        }, 200);
      },
      () => { }
    );
  }

  removeCard() {
    if (!this.selectedPlayer) return;

    // If multiple cards selected, remove all of them
    if (this.selectedCardIndices.size > 0) {
      const cardsToRemove: string[] = [];
      this.selectedCardIndices.forEach(index => {
        if (this.availableCards[index]) {
          cardsToRemove.push(this.availableCards[index]);
        }
      });

      if (cardsToRemove.length === 0) return;

      // Remove cards one by one
      let removed = 0;
      cardsToRemove.forEach(cardName => {
        this.sandboxService.modifyCard(
          this.gameId,
          this.selectedPlayer.id,
          'remove',
          cardName,
          this.fromZone
        ).subscribe(
          () => {
            removed++;
            if (removed === cardsToRemove.length) {
              this.alertService.toast(this.translate.instant('SANDBOX_CARD_REMOVED'));
              this.selectedCardIndices.clear();
              this.selectedCardIndex = null;
              this.cardName = '';
              // Refresh the available cards list after a short delay to allow state to update
              setTimeout(() => {
                this.refreshCardsList();
              }, 200);
            }
          },
          () => { }
        );
      });
    } else if (this.cardName.trim()) {
      // Single card removal
      this.sandboxService.modifyCard(
        this.gameId,
        this.selectedPlayer.id,
        'remove',
        this.cardName.trim(),
        this.fromZone
      ).subscribe(
        () => {
          this.alertService.toast(this.translate.instant('SANDBOX_CARD_REMOVED'));
          this.cardName = '';
          this.selectedCardIndex = null;
          // Refresh the available cards list after a short delay to allow state to update
          setTimeout(() => {
            this.refreshCardsList();
          }, 200);
        },
        () => { }
      );
    }
  }

  moveCard() {
    if (!this.selectedPlayer) return;

    // If multiple cards selected, move all of them
    if (this.selectedCardIndices.size > 0) {
      const cardsToMove: string[] = [];
      this.selectedCardIndices.forEach(index => {
        if (this.availableCards[index]) {
          cardsToMove.push(this.availableCards[index]);
        }
      });

      if (cardsToMove.length === 0) return;

      // Move cards one by one
      let moved = 0;
      cardsToMove.forEach(cardName => {
        this.sandboxService.modifyCard(
          this.gameId,
          this.selectedPlayer.id,
          'move',
          cardName,
          this.fromZone,
          this.toZone
        ).subscribe(
          () => {
            moved++;
            if (moved === cardsToMove.length) {
              this.alertService.toast(this.translate.instant('SANDBOX_CARD_MOVED'));
              this.selectedCardIndices.clear();
              this.selectedCardIndex = null;
              this.cardName = '';
              // Refresh the available cards list after a short delay to allow state to update
              setTimeout(() => {
                this.refreshCardsList();
              }, 200);
            }
          },
          () => { }
        );
      });
    } else if (this.cardName.trim()) {
      // Single card move
      this.sandboxService.modifyCard(
        this.gameId,
        this.selectedPlayer.id,
        'move',
        this.cardName.trim(),
        this.fromZone,
        this.toZone
      ).subscribe(
        () => {
          this.alertService.toast(this.translate.instant('SANDBOX_CARD_MOVED'));
          this.cardName = '';
          this.selectedCardIndex = null;
          // Refresh the available cards list after a short delay to allow state to update
          setTimeout(() => {
            this.refreshCardsList();
          }, 200);
        },
        () => { }
      );
    }
  }

  applyPokemonModifications() {
    if (!this.selectedPlayer) return;

    const mods: any = {};
    if (this.pokemonMods.damage !== null) mods.damage = this.pokemonMods.damage;
    if (this.pokemonMods.hp !== null) mods.hp = this.pokemonMods.hp;
    if (this.pokemonMods.energyCount !== null && this.pokemonMods.energyCount > 0) {
      mods.energyCount = this.pokemonMods.energyCount;
      // If energy type is selected, attach that specific energy type
      if (this.selectedEnergyType) {
        mods.energyTypes = [this.selectedEnergyType];
      }
    }
    mods.conditions = this.pokemonMods.conditions;

    this.sandboxService.modifyPokemon(
      this.gameId,
      this.selectedPlayer.id,
      this.pokemonLocation,
      mods,
      this.pokemonLocation === 'bench' ? this.selectedBenchIndex : undefined
    ).subscribe(
      () => {
        this.alertService.toast(this.translate.instant('SANDBOX_POKEMON_MODIFIED'));
      },
      () => { }
    );
  }

}

