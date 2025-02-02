import { Component, Input, OnChanges } from '@angular/core';
import { DamageTransfer, CardTarget, DamageMap, PokemonCardList, RemoveDamagePrompt, GameError, GameMessage, PlayerType } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';


@Component({
  selector: 'ptcg-prompt-remove-damage',
  templateUrl: './prompt-remove-damage.component.html',
  styleUrls: ['./prompt-remove-damage.component.scss']
})
export class PromptRemoveDamageComponent implements OnChanges {

  @Input() prompt: RemoveDamagePrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;
  public isRemoveDisabled = true;
  public isAddDisabled = true;
  public damage = 0;

  private min: number;
  private max: number | undefined;

  private initialDamageMap: DamageMap[];
  private maxDamageMap: DamageMap[];
  private blockedFrom: CardTarget[];
  private blockedTo: CardTarget[];

  constructor(
    private gameService: GameService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    const results = this.buildDamageTransfers(this.pokemonData);
    this.gameService.resolvePrompt(gameId, id, results);
  }

  public onCardClick(item: PokemonItem) {
    if (item.target.player === PlayerType.BOTTOM_PLAYER && item.cardList.damage === 0) {
      return; // Prevent selection of player's Pokémon without damage
    }

    // if (this.pokemonData.matchesTarget(item, this.blockedFrom)) {
    //   return;
    // }

    this.pokemonData.unselectAll();
    item.selected = true;
    this.selectedItem = item;
    this.updateButtonDisable();
  }


  public removeDamage() {
    this.damage += 10;
    const item = this.selectedItem;
    item.cardList = Object.assign(new PokemonCardList(), item.cardList);
    item.cardList.damage -= 10;
    if (this.pokemonData.matchesTarget(item, this.blockedFrom)) {
      return;
    }
    this.updateButtonDisable();
    this.updateIsInvalid();
  }

  public addDamage() {
    if (this.selectedItem && this.selectedItem.target.player === PlayerType.BOTTOM_PLAYER) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    this.damage -= 10;
    const item = this.selectedItem;
    item.cardList = Object.assign(new PokemonCardList(), item.cardList);
    item.cardList.damage += 10;
    this.updateButtonDisable();
    this.updateIsInvalid();
  }


  public reset() {
    this.damage = 0;
    const pokemonRows = this.pokemonData.getRows();
    for (const row of pokemonRows) {
      for (const item of row.items) {
        const initial = this.initialDamageMap.find(i => {
          return i.target.player === item.target.player
            && i.target.slot === item.target.slot
            && i.target.index === item.target.index;
        });
        if (initial !== undefined && initial.damage !== item.cardList.damage) {
          item.cardList = Object.assign(new PokemonCardList(), item.cardList);
          item.cardList.damage = initial.damage;
        }
      }
    }
    this.updateButtonDisable();
    this.updateIsInvalid();
  }

  private updateButtonDisable() {
    if (this.selectedItem === undefined) {
      this.isAddDisabled = true;
      this.isRemoveDisabled = true;
      return;
    }

    const target = this.selectedItem.target;
    const cardList = this.selectedItem.cardList;
    const damageMap = this.maxDamageMap.find(d => {
      return d.target.player === target.player
        && d.target.slot === target.slot
        && d.target.index === target.index;
    });
    const allowedDamage: number | undefined = damageMap && damageMap.damage;

    let isAddDisabled = false;
    let isRemoveDisabled = false;

    if (cardList.damage <= 0) {
      isRemoveDisabled = true;
    }
    if (this.damage === 0 || cardList.damage >= allowedDamage) {
      isAddDisabled = true;
    }

    const initial = this.initialDamageMap.find(i => {
      return i.target.player === target.player
        && i.target.slot === target.slot
        && i.target.index === target.index;
    });
    const results = this.buildDamageTransfers(this.pokemonData);
    const transfers = results.length + Math.round(this.damage / 10);
    if (transfers >= this.max && initial !== undefined) {
      if (initial.damage >= cardList.damage) {
        isRemoveDisabled = true;
      }
    }

    this.isAddDisabled = isAddDisabled;
    this.isRemoveDisabled = isRemoveDisabled;
  }

  private buildDamageTransfers(pokemonData: PokemonData): DamageTransfer[] {
    const fromItems: PokemonItem[] = [];
    const toItems: PokemonItem[] = [];
    const pokemonRows = pokemonData.getRows();

    for (const row of pokemonRows) {
      for (const item of row.items) {

        const initial = this.initialDamageMap.find(i => {
          return i.target.player === item.target.player
            && i.target.slot === item.target.slot
            && i.target.index === item.target.index;
        });

        if (initial !== undefined) {
          for (let i = initial.damage; i > item.cardList.damage; i -= 10) {
            fromItems.push(item);
          }
          for (let i = initial.damage; i < item.cardList.damage; i += 10) {
            toItems.push(item);
          }
        }
      }
    }

    const results: DamageTransfer[] = [];
    const len = Math.min(fromItems.length, toItems.length);
    for (let i = 0; i < len; i++) {
      results.push({ from: fromItems[i].target, to: toItems[i].target });
    }

    return results;
  }

  private updateIsInvalid() {
    const results = this.buildDamageTransfers(this.pokemonData);
    let isInvalid = false;
    if (this.damage > 0) {
      isInvalid = true;
    }
    if (this.min > results.length) {
      isInvalid = true;
    }
    if (this.max !== undefined && this.max < results.length) {
      isInvalid = true;
    }
    this.isInvalid = isInvalid;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.blockedFrom = prompt.options.blockedFrom;
      this.blockedTo = prompt.options.blockedTo;
      this.allowedCancel = prompt.options.allowCancel;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.maxDamageMap = prompt.maxAllowedDamage;
      this.selectedItem = undefined;

      this.initialDamageMap = [];
      const pokemonRows = this.pokemonData.getRows();
      for (const row of pokemonRows) {
        for (const item of row.items) {
          if (item.cardList.cards.length > 0) {
            const damageItem = { target: item.target, damage: item.cardList.damage };
            this.initialDamageMap.push(damageItem);
          }
        }
      }

      this.min = prompt.options.min;
      this.max = prompt.options.max;
      this.updateIsInvalid();
    }
  }

}
