import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, GameMessage, GamePhase, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../../game/store/effects/attack-effects';
import { HANDLE_ABILITY_BLOCK, POKEBODY_TYPES } from '../../../game/store/prefabs/ability-lock';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Shuckle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Pot Shell',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Shuckle by your opponent\'s Pokémon that has any Special Energy cards attached to it.'
  }];

  public attacks = [{
    name: 'Ferment Poison',
    cost: [G, C],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned. As long as the Defending Pokémon remains Poisoned by this attack, it can\'t use any Poké-Body.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Shuckle';
  public fullName: string = 'Shuckle SW';

  public readonly FERMENT_POISON_MARKER = 'FERMENT_POISON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pot Shell
    if (
      effect instanceof AbstractAttackEffect &&
      effect.target.cards.includes(this) &&
      effect.target.getPokemonCard() === this &&
      state.phase === GamePhase.ATTACK
    ) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      const hasSpecialEnergy = effect.source.cards.some(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
      );
      if (hasSpecialEnergy) {
        effect.preventDefault = true;
      }
    }

    // Ferment Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      ADD_MARKER(this.FERMENT_POISON_MARKER, effect.opponent.active, this);
    }

    HANDLE_ABILITY_BLOCK(
      effect,
      ({ card }) => {
        const cardList = StateUtils.findCardList(state, card) as PokemonCardList;
        if (!(cardList instanceof PokemonCardList)) {
          return false;
        }
        if (!HAS_MARKER(this.FERMENT_POISON_MARKER, cardList, this)) {
          return false;
        }
        if (!cardList.specialConditions.includes(SpecialCondition.POISONED)) {
          cardList.marker.removeMarker(this.FERMENT_POISON_MARKER, this);
          return false;
        }
        return cardList.getPokemonCard() === card;
      },
      {
        powerTypes: POKEBODY_TYPES,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    return state;
  }
}
