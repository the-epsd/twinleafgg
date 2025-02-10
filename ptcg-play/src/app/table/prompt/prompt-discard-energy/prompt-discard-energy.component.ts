import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Card, CardTarget, DiscardEnergyPrompt, FilterType, SuperType } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';
import { CardsContainerComponent } from '../cards-container/cards-container.component';

interface DiscardEnergyResult {
  from: PokemonItem;
  card: Card;
  container: CardsContainerComponent;
}

@Component({
  selector: 'ptcg-prompt-discard-energy',
  templateUrl: './prompt-discard-energy.component.html',
  styleUrls: ['./prompt-discard-energy.component.scss']
})
export class PromptDiscardEnergyComponent implements OnInit {
  @Input() prompt: DiscardEnergyPrompt;
  @Input() gameState: LocalGameState;
  @ViewChild('cardsContainer') cardsContainer: CardsContainerComponent;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public currentPokemonCards: Card[] = [];
  public results: DiscardEnergyResult[] = [];
  public isInvalid = true;
  public blocked: number[] = [];
  public filter: FilterType;
  public max: number | undefined;
  public allowedCancel: boolean;
  private originalCardState = new Map<PokemonItem, Card[]>();
  public tempDiscardPile: Card[] = [];
  private selectedEnergies: DiscardEnergyResult[] = [];
  private selectedCards = new Set<Card>();

  constructor(private gameService: GameService) { }

  ngOnInit() {
    if (this.prompt && this.gameState) {
      this.initializePrompt();
      this.validateSelection();
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

    // Store initial card states
    this.pokemonData.getRows().forEach(row => {
      row.items.forEach(item => {
        this.originalCardState.set(item, [...item.cardList.cards]);
      });
    });
  }

  public onCardClick(item: PokemonItem): void {
    if (this.selectedItem) {
      this.selectedItem.selected = false;
    }

    this.selectedItem = item;
    this.selectedItem.selected = true;

    // Filter out already selected cards from the viewport
    this.currentPokemonCards = item.cardList.cards.filter(
      card => card.superType === SuperType.ENERGY &&
        !this.selectedCards.has(card)
    );
  }

  public onChange(indices: number[]): void {
    if (!this.selectedItem) return;

    const selectedFromCurrentPokemon = indices.map(i => this.currentPokemonCards[i]);

    // Update global selection set
    selectedFromCurrentPokemon.forEach(card => this.selectedCards.add(card));

    // Update results with all selected cards
    this.results = Array.from(this.selectedCards).map(card => ({
      from: this.findPokemonForCard(card),
      card,
      container: this.cardsContainer
    }));

    this.validateSelection();
  }

  private findPokemonForCard(card: Card): PokemonItem {
    return this.pokemonData.getRows()
      .flatMap(row => row.items)
      .find(item => item.cardList.cards.includes(card))!;
  }

  private validateSelection(): void {
    const selectedCards = this.results.map(result => ({
      from: result.from.target,
      to: null,
      card: result.card
    }));

    this.isInvalid = !this.prompt.validate(selectedCards);
  }

  public reset(): void {
    // Clear all selections
    this.selectedCards.clear();
    this.results = [];

    // Restore original card lists for all Pokemon
    this.pokemonData.getRows().forEach(row => {
      row.items.forEach(item => {
        item.selected = false;
        item.cardList.cards = [...this.originalCardState.get(item)!];
      });
    });

    // Update current Pokemon's cards if one is selected
    if (this.selectedItem) {
      this.currentPokemonCards = this.selectedItem.cardList.cards.filter(
        card => card.superType === SuperType.ENERGY
      );
    }

    this.validateSelection();
  }


  public confirm(): void {
    // Log 4: Final validation and confirmation
    console.log('Confirming energy selection:', this.results);
    const results = this.results.map(result => ({
      from: result.from.target,
      index: result.from.cardList.cards.indexOf(result.card),
      container: result.container
    }));
    console.log('Final results to be sent:', results);

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
