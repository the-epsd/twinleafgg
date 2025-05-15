import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Card, DiscardEnergyPrompt, FilterType, SuperType, State, PlayerType, SlotType, CardTarget, PokemonCardList } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Subscription, interval } from 'rxjs';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

// Interfaces for our self-contained implementation
export interface PokemonCardItem {
  cardList: PokemonCardList;
  selected: boolean;
  target: CardTarget;
  playerType: PlayerType;
  slot: SlotType;
  index: number;
}

export interface EnergySelection {
  card: Card;
  pokemon: PokemonCardItem;
  originalIndex: number;
  scanUrl?: string;
}

@Component({
  selector: 'ptcg-prompt-discard-energy',
  templateUrl: './prompt-discard-energy.component.html',
  styleUrls: ['./prompt-discard-energy.component.scss']
})
export class PromptDiscardEnergyComponent implements OnInit, OnDestroy {
  @Input() prompt: DiscardEnergyPrompt;
  @Input() gameState: LocalGameState;

  // Pokemon data
  public pokemonItems: PokemonCardItem[] = [];
  public activeItems: PokemonCardItem[] = [];
  public benchItems: PokemonCardItem[] = [];

  // Current selection state
  public selectedPokemon: PokemonCardItem | null = null;
  public availableEnergies: Card[] = [];
  public selectedEnergies: EnergySelection[] = [];

  // Prompt config
  public isInvalid = true;
  public allowedCancel = false;
  public minSelection = 0;
  public maxSelection: number | undefined;
  public blockedFrom: CardTarget[] = [];
  public blockedMap: { source: CardTarget, blocked: number[] }[] = [];

  // Display options
  public PlayerType = PlayerType;
  public statusMessage = '';

  // Debug state to track reset
  private resetCount = 0;
  private stateCheckSubscription: Subscription | null = null;

  public isConfirming = false;

  private confirmAttempts = 0;
  private lastSelectionSent: string | null = null;

  constructor(
    private gameService: GameService,
    private cardsBaseService: CardsBaseService
  ) { }

  ngOnInit() {
    if (this.prompt && this.gameState) {
      console.log('Initializing prompt:', this.prompt);
      this.initializePrompt();

      // Start a polling interval to check if the prompt is still active
      // This is a backup approach since we can't directly access socketService
      this.stateCheckSubscription = interval(1000).subscribe(() => {
        if (this.isConfirming) {
          console.log('Checking if prompt is still active...');
          // Check if this prompt ID is still in the list of active prompts
          const isPromptStillActive = this.gameState.state.prompts.some(p => p.id === this.prompt.id);

          if (!isPromptStillActive) {
            console.log('Prompt was resolved (detected by interval check)');
            this.isConfirming = false;
            this.statusMessage = 'Selection confirmed!';
            setTimeout(() => this.statusMessage = '', 2000);

            // Stop checking once resolved
            this.stateCheckSubscription?.unsubscribe();
            this.stateCheckSubscription = null;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.stateCheckSubscription) {
      this.stateCheckSubscription.unsubscribe();
      this.stateCheckSubscription = null;
    }
  }

  private initializePrompt(): void {
    const state = this.gameState.state;

    // Initialize prompt config
    this.allowedCancel = this.prompt.options.allowCancel;
    this.minSelection = this.prompt.options.min;
    this.maxSelection = this.prompt.options.max;
    this.blockedFrom = this.prompt.options.blockedFrom || [];
    this.blockedMap = this.prompt.options.blockedMap || [];

    console.log('Prompt config:', {
      allowedCancel: this.allowedCancel,
      minSelection: this.minSelection,
      maxSelection: this.maxSelection,
      blockedFrom: this.blockedFrom,
      blockedMap: this.blockedMap
    });

    // If minSelection is 0, empty selections are valid, so isInvalid should be false initially
    if (this.minSelection === 0) {
      console.log('Setting initial validation to valid (minSelection is 0)');
      this.isInvalid = false;
    }

    // Build Pokemon items from state
    this.buildPokemonItems(state);

    // Run initial validation to ensure state is correct
    this.validateSelection();
  }

  private buildPokemonItems(state: State): void {
    const player = state.players.find(p => p.id === this.prompt.playerId);
    const opponent = state.players.find(p => p.id !== this.prompt.playerId);

    if (!player || !opponent) {
      console.error('Failed to find players:', { promptPlayerId: this.prompt.playerId, playerIds: state.players.map(p => p.id) });
      return;
    }

    const playerSlots = this.getPokemonSlots(player, PlayerType.BOTTOM_PLAYER);
    const opponentSlots = this.getPokemonSlots(opponent, PlayerType.TOP_PLAYER);

    this.pokemonItems = [...playerSlots, ...opponentSlots];

    console.log('Built Pokemon items:', {
      playerSlots: playerSlots.length,
      opponentSlots: opponentSlots.length,
      totalItems: this.pokemonItems.length
    });

    // Segregate items for display purposes
    this.activeItems = this.pokemonItems.filter(item => item.slot === SlotType.ACTIVE);
    this.benchItems = this.pokemonItems.filter(item => item.slot === SlotType.BENCH);

    console.log('Segregated Pokemon items:', {
      activeItems: this.activeItems.length,
      benchItems: this.benchItems.length
    });
  }

  private getPokemonSlots(player: any, playerType: PlayerType): PokemonCardItem[] {
    const items: PokemonCardItem[] = [];

    // Check if the player type is included in the prompt
    if (this.prompt.playerType !== PlayerType.ANY && this.prompt.playerType !== playerType) {
      console.log(`Skipping player type ${playerType} (not included in prompt player type ${this.prompt.playerType})`);
      return items;
    }

    // Add active Pokemon if the slot type is included
    if (this.prompt.slots.includes(SlotType.ACTIVE)) {
      const target: CardTarget = { player: playerType, slot: SlotType.ACTIVE, index: 0 };

      // Skip if this target is in the blockedFrom list
      const isBlocked = this.isTargetBlocked(target);
      if (isBlocked) {
        console.log(`Skipping blocked active Pokémon at ${playerType}-${SlotType.ACTIVE}-0`);
      } else {
        items.push(this.createPokemonItem(player.active, playerType, SlotType.ACTIVE, 0));
      }
    }

    // Add bench Pokemon if the slot type is included
    if (this.prompt.slots.includes(SlotType.BENCH)) {
      player.bench.forEach((bench: PokemonCardList, index: number) => {
        const target: CardTarget = { player: playerType, slot: SlotType.BENCH, index };

        // Skip if this target is in the blockedFrom list
        const isBlocked = this.isTargetBlocked(target);
        if (isBlocked) {
          console.log(`Skipping blocked bench Pokémon at ${playerType}-${SlotType.BENCH}-${index}`);
        } else {
          items.push(this.createPokemonItem(bench, playerType, SlotType.BENCH, index));
        }
      });
    }

    return items;
  }

  private isTargetBlocked(target: CardTarget): boolean {
    if (!this.blockedFrom) return false;

    return this.blockedFrom.some(blocked =>
      blocked.player === target.player &&
      blocked.slot === target.slot &&
      blocked.index === target.index
    );
  }

  private createPokemonItem(cardList: PokemonCardList, playerType: PlayerType, slotType: SlotType, index: number): PokemonCardItem {
    return {
      cardList,
      selected: false,
      target: { player: playerType, slot: slotType, index },
      playerType,
      slot: slotType,
      index
    };
  }

  public selectPokemon(pokemon: PokemonCardItem): void {
    console.log('Selecting Pokemon:', {
      playerType: pokemon.playerType,
      slot: pokemon.slot,
      index: pokemon.index,
      cardCount: pokemon.cardList.cards.length,
      energyCount: pokemon.cardList.cards.filter(c => c.superType === SuperType.ENERGY).length,
      visibleEnergyCount: this.getVisibleEnergyCards(pokemon).length
    });

    // Check if the Pokemon has any energy cards available
    if (this.getVisibleEnergyCards(pokemon).length === 0) {
      console.log('Pokemon has no energy cards available');
      return;
    }

    // Clear previous selection
    if (this.selectedPokemon) {
      this.selectedPokemon.selected = false;
    }

    // Set new selection
    pokemon.selected = true;
    this.selectedPokemon = pokemon;

    // Update available energies
    this.updateAvailableEnergies();
  }

  private updateAvailableEnergies(): void {
    if (!this.selectedPokemon) {
      this.availableEnergies = [];
      return;
    }

    // Get all energy cards from the selected Pokemon
    const allEnergyCards = this.selectedPokemon.cardList.cards.filter(card =>
      card.superType === SuperType.ENERGY
    );

    // Get blocked indices for this Pokemon
    const blockedIndices = this.getBlockedIndices(this.selectedPokemon.target);
    console.log('Blocked energy indices for this Pokémon:', blockedIndices);

    // Filter energy cards that:
    // 1. Are not blocked by blockedMap
    // 2. Haven't been selected yet
    this.availableEnergies = allEnergyCards.filter((card, index) => {
      // Check if this card index is blocked
      if (blockedIndices.includes(index)) {
        return false;
      }

      // Check if this card has already been selected
      const isAlreadySelected = this.selectedEnergies.some(e =>
        e.card === card &&
        e.pokemon.target.player === this.selectedPokemon.target.player &&
        e.pokemon.target.slot === this.selectedPokemon.target.slot &&
        e.pokemon.target.index === this.selectedPokemon.target.index
      );

      return !isAlreadySelected;
    });

    // Pre-process cards to get their scan URLs
    for (const card of this.availableEnergies) {
      this.cardsBaseService.getScanUrl(card);
    }

    console.log('Available energies updated:', {
      total: allEnergyCards.length,
      available: this.availableEnergies.length,
      blocked: blockedIndices.length
    });
  }

  private getBlockedIndices(target: CardTarget): number[] {
    if (!this.blockedMap) return [];

    const blockedItem = this.blockedMap.find(item =>
      item.source.player === target.player &&
      item.source.slot === target.slot &&
      item.source.index === target.index
    );

    return blockedItem ? blockedItem.blocked : [];
  }

  public toggleEnergySelection(energy: Card): void {
    if (!this.selectedPokemon) {
      return;
    }

    // Store the card reference and its index in the Pokemon's card list
    const originalIndex = this.selectedPokemon.cardList.cards.indexOf(energy);
    console.log('Toggle energy selection:', {
      energyName: energy.name,
      originalIndex,
      cardListLength: this.selectedPokemon.cardList.cards.length
    });

    if (originalIndex === -1) {
      console.error('Energy card not found in Pokemon card list!', {
        energyName: energy.name,
        pokemonName: this.selectedPokemon.cardList.cards[0]?.name || 'Unknown'
      });
      return;
    }

    // Check if this card is already selected
    const existingIndex = this.selectedEnergies.findIndex(s =>
      s.card === energy &&
      s.pokemon.target.player === this.selectedPokemon.target.player &&
      s.pokemon.target.slot === this.selectedPokemon.target.slot &&
      s.pokemon.target.index === this.selectedPokemon.target.index
    );

    if (existingIndex >= 0) {
      // Remove the selection
      this.selectedEnergies.splice(existingIndex, 1);
      console.log(`Energy deselected. Current selection count: ${this.selectedEnergies.length}`);
    } else {
      // Check max selection limit before adding
      if (this.maxSelection !== undefined && this.selectedEnergies.length >= this.maxSelection) {
        console.warn(`Cannot select more energy cards: Maximum selection limit (${this.maxSelection}) reached`);
        this.statusMessage = `Maximum ${this.maxSelection} energy card(s) allowed.`;
        setTimeout(() => this.statusMessage = '', 3000);
        return;
      }

      // Get the scan URL for the card
      const scanUrl = this.cardsBaseService.getScanUrl(energy);

      // Add the selection
      this.selectedEnergies.push({
        card: energy,
        pokemon: this.selectedPokemon,
        originalIndex,
        scanUrl
      });
      console.log(`Energy selected. Current selection count: ${this.selectedEnergies.length}`);
    }

    // Update available energies and validate
    this.updateAvailableEnergies();

    // Check if the currently selected Pokemon still has energy cards
    // If not, clear the selection to prevent a confusing UI state
    if (this.selectedPokemon && this.getVisibleEnergyCards(this.selectedPokemon).length === 0) {
      console.log('Selected Pokemon has no more energy cards, clearing selection');
      this.selectedPokemon.selected = false;
      this.selectedPokemon = null;
    }

    this.validateSelection();
  }

  public removeEnergySelection(selection: EnergySelection): void {
    console.log('Removing energy selection:', {
      energyName: selection.card.name,
      pokemonTarget: selection.pokemon.target,
      originalIndex: selection.originalIndex
    });

    const index = this.selectedEnergies.indexOf(selection);
    if (index >= 0) {
      this.selectedEnergies.splice(index, 1);

      // Update available energies if removing from currently selected Pokemon
      if (this.selectedPokemon &&
        selection.pokemon.target.player === this.selectedPokemon.target.player &&
        selection.pokemon.target.slot === this.selectedPokemon.target.slot &&
        selection.pokemon.target.index === this.selectedPokemon.target.index) {
        this.updateAvailableEnergies();
      }

      this.validateSelection();
    } else {
      console.warn('Energy selection not found for removal');
    }
  }

  private validateSelection(): void {
    console.log('Validating selection...', {
      minSelection: this.minSelection,
      maxSelection: this.maxSelection,
      currentCount: this.selectedEnergies.length
    });

    // Special case: If minSelection is 0 and no cards selected, this is valid
    if (this.minSelection === 0 && this.selectedEnergies.length === 0) {
      console.log('Validation succeeded: No selection required (minSelection is 0)');
      this.isInvalid = false;
      console.log('Final validation state:', { isInvalid: this.isInvalid });
      return;
    }

    // Check minimum selection count
    if (this.selectedEnergies.length < this.minSelection) {
      console.log(`Validation failed: Minimum selection not met (${this.selectedEnergies.length}/${this.minSelection})`);
      this.isInvalid = true;

      // If there are selections but not enough, show status message
      if (this.selectedEnergies.length > 0) {
        this.statusMessage = `Please select at least ${this.minSelection} energy card(s).`;
        setTimeout(() => this.statusMessage = '', 3000);
      }
      return;
    }

    // Check maximum selection count
    if (this.maxSelection !== undefined && this.selectedEnergies.length > this.maxSelection) {
      console.log(`Validation failed: Maximum selection exceeded (${this.selectedEnergies.length}/${this.maxSelection})`);
      this.isInvalid = true;
      this.statusMessage = `Please select at most ${this.maxSelection} energy card(s).`;
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    // Show selection count in UI
    if (this.selectedEnergies.length > 0) {
      const countDisplay = this.maxSelection !== undefined
        ? `${this.selectedEnergies.length}/${this.maxSelection}`
        : this.selectedEnergies.length.toString();

      console.log(`Selection count: ${countDisplay}`);
    }

    // Check for blocked energy cards
    for (const selection of this.selectedEnergies) {
      const target = selection.pokemon.target;
      const index = selection.originalIndex;

      // Check if this target is blocked
      if (this.isTargetBlocked(target)) {
        console.log(`Validation failed: Selection from blocked Pokémon: ${target.player}-${target.slot}-${target.index}`);
        this.isInvalid = true;
        return;
      }

      // Check if this energy card is blocked
      const blockedIndices = this.getBlockedIndices(target);
      if (blockedIndices.includes(index)) {
        console.log(`Validation failed: Selection of blocked energy card at index ${index}`);
        this.isInvalid = true;
        return;
      }
    }

    // Format selections for the prompt validation
    const formattedSelections = this.selectedEnergies.map(e => ({
      from: {
        player: e.pokemon.target.player,
        slot: e.pokemon.target.slot,
        index: e.pokemon.target.index
      },
      card: e.card
    }));

    console.log('Formatted selections for validation:', formattedSelections);

    // Log additional details for debugging
    if (formattedSelections.length === 0) {
      console.log('Empty selection being validated with prompt settings:', {
        promptMin: this.prompt.options.min,
        promptMax: this.prompt.options.max,
        componentMin: this.minSelection,
        componentMax: this.maxSelection,
        allowCancel: this.prompt.options.allowCancel
      });
    }

    // Check if the prompt validates the selection
    try {
      const isValid = this.prompt.validate(formattedSelections);
      this.isInvalid = !isValid;
      console.log(`Validation ${isValid ? 'succeeded' : 'failed'}:`, {
        isValid,
        isInvalid: this.isInvalid,
        selectionCount: formattedSelections.length,
        minRequired: this.minSelection
      });

      // If validation failed but min/max constraints are met, it might be due to other constraints
      if (!isValid && this.selectedEnergies.length >= this.minSelection &&
        (this.maxSelection === undefined || this.selectedEnergies.length <= this.maxSelection)) {
        console.log('Validation failed despite meeting min/max constraints - might be other restrictions');
        this.statusMessage = 'This energy combination is not valid. Try different energy cards.';
        setTimeout(() => this.statusMessage = '', 3000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      this.isInvalid = true;
    }

    console.log('Final validation state:', { isInvalid: this.isInvalid });
  }

  public resetSelection(): void {
    this.resetCount++;
    console.log(`Resetting selection (reset count: ${this.resetCount})`);

    // Reset all UI state to initial values
    if (this.selectedPokemon) {
      this.selectedPokemon.selected = false;
      this.selectedPokemon = null;
    }

    // Clear all Pokemon selections
    this.pokemonItems.forEach(item => item.selected = false);

    // Clear selections
    this.selectedEnergies = [];
    this.availableEnergies = [];
    this.isInvalid = true;

    // Reset confirmation tracking
    this.confirmAttempts = 0;
    this.lastSelectionSent = null;

    console.log('Selection reset complete');
  }

  public isEnergySelected(energy: Card): boolean {
    if (!this.selectedPokemon) return false;

    return this.selectedEnergies.some(e =>
      e.card === energy &&
      e.pokemon.target.player === this.selectedPokemon?.target.player &&
      e.pokemon.target.slot === this.selectedPokemon?.target.slot &&
      e.pokemon.target.index === this.selectedPokemon?.target.index
    );
  }

  public confirm(): void {
    console.log('Confirming selection...');

    // Check validation status
    if (this.isInvalid) {
      console.warn('Cannot confirm: Selection is invalid');
      this.statusMessage = 'Selection is invalid. Please check your selections.';
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    // Check if any energy is selected - only required when minSelection > 0
    if (this.minSelection > 0 && this.selectedEnergies.length === 0) {
      console.warn('Cannot confirm: No energies selected but minimum required');
      this.statusMessage = `Please select at least ${this.minSelection} energy card(s).`;
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    // Double-check min constraints
    if (this.selectedEnergies.length < this.minSelection) {
      console.warn(`Cannot confirm: Minimum selection not met (${this.selectedEnergies.length}/${this.minSelection})`);
      this.statusMessage = `Please select at least ${this.minSelection} energy card(s).`;
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    // Double-check max constraints
    if (this.maxSelection !== undefined && this.selectedEnergies.length > this.maxSelection) {
      console.warn(`Cannot confirm: Maximum selection exceeded (${this.selectedEnergies.length}/${this.maxSelection})`);
      this.statusMessage = `Please select at most ${this.maxSelection} energy card(s).`;
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    try {
      // Add a guard to prevent multiple confirms
      if (this.isConfirming) {
        console.log('Already confirming, ignoring additional clicks');
        return;
      }

      this.isConfirming = true;
      this.confirmAttempts++;
      this.statusMessage = 'Confirming selection...';

      // Log selection count for debugging
      const countDisplay = this.maxSelection !== undefined
        ? `${this.selectedEnergies.length}/${this.maxSelection}`
        : this.selectedEnergies.length.toString();
      console.log(`Confirming energy selection: ${countDisplay}`);

      // Double-check that we're not trying to discard from blocked Pokémon
      for (const selection of this.selectedEnergies) {
        const target = selection.pokemon.target;
        if (this.isTargetBlocked(target)) {
          console.error(`Cannot confirm: Attempting to discard from blocked Pokémon at ${target.player}-${target.slot}-${target.index}`);
          this.isConfirming = false;
          this.statusMessage = 'Cannot discard energy from this Pokémon. Try another.';
          setTimeout(() => this.statusMessage = '', 3000);
          return;
        }

        // Check if energy card is blocked
        const blockedIndices = this.getBlockedIndices(target);
        if (blockedIndices.includes(selection.originalIndex)) {
          console.error(`Cannot confirm: Attempting to discard blocked energy at index ${selection.originalIndex}`);
          this.isConfirming = false;
          this.statusMessage = 'Cannot discard this specific energy card. Try another.';
          setTimeout(() => this.statusMessage = '', 3000);
          return;
        }
      }

      // Log detailed information for debugging
      console.log('Confirm attempt details:', {
        attempt: this.confirmAttempts,
        energyCount: this.selectedEnergies.length,
        promptId: this.prompt.id,
        gameId: this.gameState.gameId,
        pokemonSources: this.selectedEnergies.map(s =>
          `${s.pokemon.playerType}-${s.pokemon.slot}-${s.pokemon.index}`
        ),
        blockedFrom: this.blockedFrom.map(b => `${b.player}-${b.slot}-${b.index}`),
        blockedMap: this.blockedMap.map(b => `${b.source.player}-${b.source.slot}-${b.source.index}: [${b.blocked.join(', ')}]`)
      });

      // Create the exact structure that the server expects
      // The server expects array of {from: CardTarget, index: number}
      const results = [];

      // Process all selected energies (will be empty array if none selected)
      for (const selection of this.selectedEnergies) {
        // Create a plain object with no references to our component objects
        results.push({
          from: {
            player: selection.pokemon.target.player,
            slot: selection.pokemon.target.slot,
            index: selection.pokemon.target.index
          },
          index: selection.originalIndex
        });
      }

      const selectionJson = JSON.stringify(results);
      console.log(`Sending selection to server (attempt ${this.confirmAttempts}):`, selectionJson);

      // Track if we're sending the same selection repeatedly
      const isDuplicateSelection = selectionJson === this.lastSelectionSent;
      if (isDuplicateSelection) {
        console.warn('Warning: Sending the same selection as the previous attempt');
      }
      this.lastSelectionSent = selectionJson;

      try {
        // Use a try/catch to handle socket errors
        this.gameService.resolvePrompt(
          this.gameState.gameId,
          this.prompt.id,
          results
        );

        console.log(`Selection sent to server - waiting for response (attempt ${this.confirmAttempts})`);

        // Reset confirming flag after a set time, so user can try again if needed
        setTimeout(() => {
          if (this.isConfirming) {
            console.log(`No response from server after 5s (attempt ${this.confirmAttempts})`);
            this.isConfirming = false;

            if (this.confirmAttempts >= 3) {
              if (this.selectedEnergies.length > 1) {
                this.statusMessage = 'Server not responding. Try simplifying your selection.';
              } else {
                this.statusMessage = 'Server not responding. Try a different energy card.';
              }
            } else {
              this.statusMessage = 'Server did not respond. Try again.';
            }

            setTimeout(() => this.statusMessage = '', 3000);
          }
        }, 5000); // Increased timeout to give server more time
      } catch (serverError) {
        console.error(`Server error during confirm (attempt ${this.confirmAttempts}):`, serverError);
        this.isConfirming = false;
        this.statusMessage = 'Error confirming selection. Try different energy cards.';
        setTimeout(() => this.statusMessage = '', 3000);
      }
    } catch (error) {
      console.error(`Error in confirm method (attempt ${this.confirmAttempts}):`, error);
      this.isConfirming = false;
      this.statusMessage = 'An error occurred. Please try again.';
      setTimeout(() => this.statusMessage = '', 3000);
    }
  }

  public cancel(): void {
    console.log('Cancelling prompt');
    this.gameService.resolvePrompt(
      this.gameState.gameId,
      this.prompt.id,
      null
    );
  }

  public minimize(): void {
    console.log('Minimizing prompt');
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public retryWithSingleEnergy(): void {
    if (this.selectedEnergies.length <= 1) {
      // Already have 0 or 1 selected, nothing to simplify
      return;
    }

    console.log('Retrying with only a single energy card');

    // Keep only the first energy card
    const firstSelection = this.selectedEnergies[0];
    this.selectedEnergies = [firstSelection];

    // Update available energies if needed
    this.updateAvailableEnergies();

    // Validate the simplified selection
    this.validateSelection();

    // Show status message
    this.statusMessage = 'Simplified to a single energy card. Try confirming again.';
    setTimeout(() => this.statusMessage = '', 3000);
  }

  public getCardScanUrl(card: Card): string {
    return this.cardsBaseService.getScanUrl(card);
  }

  /**
   * Gets the custom image URL for energy cards
   */
  public getCustomEnergyImageUrl(card: Card): string {
    if (!card || card.superType !== SuperType.ENERGY) return '';

    // Handle special energy cards
    const specialEnergyUrls = {
      'Double Turbo Energy': 'assets/energy/double-turbo.png',
      'Jet Energy': 'assets/energy/jet.png',
      'Gift Energy': 'assets/energy/gift.png',
      'Mist Energy': 'assets/energy/mist.png',
      'Legacy Energy': 'assets/energy/legacy.png',
      'Neo Upper Energy': 'assets/energy/neo-upper.png',
      'Electrode': 'assets/energy/neo-upper.png',
      // Add more special energy mappings as needed
    };

    // Check if it's a special energy first
    if (specialEnergyUrls[card.name]) {
      return specialEnergyUrls[card.name];
    }

    // Handle basic energy cards
    const basicEnergyUrls = {
      'Grass Energy': 'assets/energy/grass.png',
      'Fire Energy': 'assets/energy/fire.png',
      'Water Energy': 'assets/energy/water.png',
      'Lightning Energy': 'assets/energy/lightning.png',
      'Psychic Energy': 'assets/energy/psychic.png',
      'Fighting Energy': 'assets/energy/fighting.png',
      'Darkness Energy': 'assets/energy/dark.png',
      'Metal Energy': 'assets/energy/metal.png',
      'Fairy Energy': 'assets/energy/fairy.png',
      'Electrode': 'assets/energy/electrode.png',
      'Holon\'s Castform': 'assets/energy/holon-castform.png',
      'Holon\'s Magnemite': 'assets/energy/holons-magnemite.png',
      'Holon\'s Magneton': 'assets/energy/holons-magneton.png',
      'Holon\'s Voltorb': 'assets/energy/holons-voltorb.png',
      'Holon\'s Electrode': 'assets/energy/holons-electrode.png',
    };

    return basicEnergyUrls[card.name] || '';
  }

  /**
   * Gets the energy cards to display on a Pokemon card
   * This shows only the currently visible (not selected) energy cards
   * Limits the display to 5 icons to prevent overcrowding
   */
  public getVisibleEnergyCards(pokemon: PokemonCardItem): Card[] {
    if (!pokemon || !pokemon.cardList) return [];

    // Get all energy cards attached to this Pokemon
    const allEnergyCards = pokemon.cardList.cards.filter(card =>
      card.superType === SuperType.ENERGY
    );

    // Filter out energy cards that are currently selected for discard
    const selectedEnergyCards = this.selectedEnergies
      .filter(selection =>
        selection.pokemon.target.player === pokemon.target.player &&
        selection.pokemon.target.slot === pokemon.target.slot &&
        selection.pokemon.target.index === pokemon.target.index
      )
      .map(selection => selection.card);

    // Get visible energy cards (those not selected for discard)
    const visibleEnergy = allEnergyCards.filter(card => !selectedEnergyCards.includes(card));

    // Limit to 5 energy icons maximum
    return visibleEnergy.slice(0, 5);
  }

  public showCardInfo(card: Card, pokemonCardList?: PokemonCardList): void {
    if (pokemonCardList) {
      // If we have a full PokemonCardList, use it for a better display
      const mainCard = pokemonCardList.getPokemonCard() || card;
      this.cardsBaseService.showCardInfo({ card: mainCard, cardList: pokemonCardList });
    } else {
      // For individual cards (like energies)
      this.cardsBaseService.showCardInfo({ card });
    }
  }

  /**
   * Gets the total number of energy cards (including selected ones)
   * Used to show the count when there are more than displayed
   */
  public getTotalEnergyCount(pokemon: PokemonCardItem): number {
    if (!pokemon || !pokemon.cardList) return 0;

    // Count all energy cards on this Pokémon
    return pokemon.cardList.cards.filter(card =>
      card.superType === SuperType.ENERGY
    ).length;
  }
}
