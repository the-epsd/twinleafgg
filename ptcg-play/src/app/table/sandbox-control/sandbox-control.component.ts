import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Player, GamePhase, State } from 'ptcg-server';
import { concat } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { SandboxService } from '../../api/services/sandbox.service';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

interface SandboxCardOption {
  name: string;
  /** Zone card index, or prize-slot index when the zone is prizes. */
  index: number;
}

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
  public availableCards: SandboxCardOption[] = [];
  public zones = [
    { value: 'hand', label: 'Hand' },
    { value: 'deck', label: 'Deck' },
    { value: 'discard', label: 'Discard' },
    { value: 'lostzone', label: 'Lost Zone' },
    { value: 'prizes', label: 'Prizes' },
    { value: 'stadium', label: 'Stadium' },
    { value: 'supporter', label: 'Supporter' },
  ];
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
    { value: GamePhase.DRAW, label: 'DRAW' },
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

  getCardsFromZone(zone: string): SandboxCardOption[] {
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

    const named = (cards: { fullName: string }[], prizeSlot?: number): SandboxCardOption[] =>
      cards.map((card, index) => ({
        name: card.fullName,
        index: prizeSlot !== undefined ? prizeSlot : index
      }));

    // Get cards from the actual CardList objects
    switch (zone) {
      case 'hand':
        return named(targetPlayer.hand.cards);
      case 'deck':
        return named(targetPlayer.deck.cards);
      case 'discard':
        return named(targetPlayer.discard.cards);
      case 'lostzone':
        return named(targetPlayer.lostzone.cards);
      case 'stadium':
        return named(targetPlayer.stadium.cards);
      case 'supporter':
        return named(targetPlayer.supporter.cards);
      case 'prizes':
        return targetPlayer.prizes.reduce((cards, prize, prizeIndex) => {
          cards.push(...named(prize.cards, prizeIndex));
          return cards;
        }, [] as SandboxCardOption[]);
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
      this.cardName = this.availableCards[this.selectedCardIndex].name;
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
        if (oldIndex < oldCards.length) {
          const oldCardName = oldCards[oldIndex].name;
          const newIndex = this.availableCards.findIndex(c => c.name === oldCardName);
          if (newIndex !== -1) {
            newSelectedIndices.add(newIndex);
          }
        }
      });
      this.selectedCardIndices = newSelectedIndices;

      // If the selected card is no longer available, clear selection
      if (this.selectedCardIndex !== null) {
        if (this.selectedCardIndex >= this.availableCards.length ||
            this.availableCards[this.selectedCardIndex].name !== this.cardName) {
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

  shuffleDeck() {
    if (!this.selectedPlayer) {
      return;
    }
    this.sandboxService.modifyPlayer(this.gameId, this.selectedPlayer.id, { shuffleDeck: true }).subscribe(
      () => {
        this.alertService.toast(this.translate.instant('SANDBOX_DECK_SHUFFLED'));
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
    this.runCardActions(this.selectedCardEntries(), 'remove', 'SANDBOX_CARD_REMOVED');
  }

  moveCard() {
    this.runCardActions(this.selectedCardEntries(), 'move', 'SANDBOX_CARD_MOVED');
  }

  private selectedCardEntries(): Array<{ name: string; index?: number }> {
    if (this.selectedCardIndices.size > 0) {
      return [...this.selectedCardIndices]
        .map(index => this.availableCards[index])
        .filter((card): card is SandboxCardOption => !!card)
        .sort((a, b) => b.index - a.index);
    }
    if (this.selectedCardIndex !== null && this.availableCards[this.selectedCardIndex]) {
      return [this.availableCards[this.selectedCardIndex]];
    }
    if (this.cardName.trim()) {
      return [{ name: this.cardName.trim() }];
    }
    return [];
  }

  private runCardActions(
    entries: Array<{ name: string; index?: number }>,
    action: 'remove' | 'move',
    successKey: string
  ) {
    if (!this.selectedPlayer || entries.length === 0) {
      return;
    }
    const playerId = this.selectedPlayer.id;
    const ops = entries.map(entry => this.sandboxService.modifyCard(
      this.gameId,
      playerId,
      action,
      entry.name,
      this.fromZone,
      action === 'move' ? this.toZone : undefined,
      entry.index
    ));
    concat(...ops).pipe(toArray()).subscribe(
      () => {
        this.alertService.toast(this.translate.instant(successKey));
        this.selectedCardIndices.clear();
        this.selectedCardIndex = null;
        this.cardName = '';
        setTimeout(() => {
          this.refreshCardsList();
        }, 200);
      },
      () => { }
    );
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

