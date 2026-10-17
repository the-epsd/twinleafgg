import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mantine extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Jumbo Fin',
    powerType: PowerType.POKEBODY,
    text: 'If Mantyke is anywhere under Mantine, the Retreat Cost for each of your Water Pokémon is ColorlessColorless less.'
  }];

  public attacks = [{
    name: 'Giant Wave',
    cost: [W, W],
    damage: 50,
    text: 'Mantine can\'t use Giant Wave during your next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Mantine';
  public fullName: string = 'Mantine MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jumbo Fin
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const mantineList = cardList as PokemonCardList;
      const hasMantyke = mantineList.getPokemons().some(p => p.name === 'Mantyke');
      if (!hasMantyke) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.WATER)) {
        return state;
      }

      for (let i = 0; i < 2; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    // Giant Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, this.attacks[0]);
    }

    return state;
  }
}
