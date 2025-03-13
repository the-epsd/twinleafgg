import { Component, Input, OnInit } from '@angular/core';
import { Card, DiscardEnergyPrompt, FilterType, SuperType } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

interface SelectedEnergy {
  card: Card;
  fromPokemon: PokemonItem;
  originalIndex: number;
}

@Component({
  selector: 'ptcg-prompt-discard-energy',
  templateUrl: './prompt-discard-energy.component.html',
  styleUrls: ['./prompt-discard-energy.component.scss']
})
export class PromptDiscardEnergyComponent implements OnInit {
  @Input() prompt: DiscardEnergyPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public availableCards: Card[] = [];
  public selectedCards: Card[] = [];
  public isInvalid = true;
  public blocked: number[] = [];
  public filter: FilterType;
  public max: number | undefined;
  public allowedCancel: boolean;

  private selectedEnergies: SelectedEnergy[] = [];
  private allEnergyCards: Card[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    if (this.prompt && this.gameState) {
      this.initializePrompt();
    }
  }

  private initializePrompt(): void {
    const state = this.gameState.state;
    this.pokemonData = new PokemonData(
      state,
      this.prompt.playerId,
      this.prompt.playerType,
      this.prompt.slots
    );

    this.filter = this.prompt.filter;
    this.max = this.prompt.options.max;
    this.allowedCancel = this.prompt.options.allowCancel;

    // Initialize all energy cards
    this.allEnergyCards = this.pokemonData.getRows()
      .flatMap(row => row.items)
      .flatMap(item => item.cardList.cards)
      .filter(card => card.superType === SuperType.ENERGY);

    // Initialize available cards with all energy cards
    this.availableCards = [...this.allEnergyCards];
  }

  public onCardClick(item: PokemonItem): void {
    if (this.selectedItem) {
      this.selectedItem.selected = false;
    }

    this.selectedItem = item;
    this.selectedItem.selected = true;

    this.updateAvailableCards();
  }

  private updateAvailableCards(): void {
    if (!this.selectedItem) {
      return;
    }

    // Show only energy cards from the selected Pokemon
    this.availableCards = this.selectedItem.cardList.cards.filter(
      card => card.superType === SuperType.ENERGY &&
        !this.selectedEnergies.some(e => e.card === card)
    );

    // Update selected cards to maintain visual state
    this.selectedCards = this.selectedEnergies.map(e => e.card);
  }

  public resetSelection(): void {
    if (!this.selectedItem) return;

    // Clear selections for the current Pokemon
    this.selectedEnergies = [];
    this.updateAvailableCards();
  }

  public onCardsChange(indices: number[]): void {
    if (!this.selectedItem) return;

    // Clear previous selections from this Pokemon
    this.selectedEnergies = this.selectedEnergies.filter(
      e => e.fromPokemon !== this.selectedItem
    );

    // Add newly selected energies
    const newSelections = indices.map(index => ({
      card: this.availableCards[index],
      fromPokemon: this.selectedItem!,
      originalIndex: this.selectedItem!.cardList.cards.indexOf(this.availableCards[index])
    }));

    this.selectedEnergies = [...this.selectedEnergies, ...newSelections];
    this.selectedCards = this.selectedEnergies.map(e => e.card);

    // Validate the selection
    const selectedCards = this.selectedEnergies.map(e => ({
      from: e.fromPokemon.target,
      to: null,
      card: e.card
    }));

    this.isInvalid = !this.prompt.validate(selectedCards);
  }

  public confirm(): void {
    const results = this.selectedEnergies.map(energy => ({
      from: energy.fromPokemon.target,
      index: energy.originalIndex,
      container: null
    }));

    this.gameService.resolvePrompt(
      this.gameState.gameId,
      this.prompt.id,
      results
    );
  }

  public minimize(): void {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel(): void {
    this.gameService.resolvePrompt(
      this.gameState.gameId,
      this.prompt.id,
      null
    );
  }
}
