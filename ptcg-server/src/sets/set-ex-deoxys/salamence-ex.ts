import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Salamenceex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public cardType: CardType = C;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 160;
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Dragon Lift',
    powerType: PowerType.POKEBODY,
    text: 'The Retreat Cost for each of your Pokémon (excluding Pokémon-ex and Baby Pokémon) is 0.'
  }];

  public attacks = [{
    name: 'Flame Jet',
    cost: [R, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon.This attack does 40 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
  },
  {
    name: 'Bright Flame',
    cost: [R, W, C, C],
    damage: 120,
    text: 'Discard 2 Energy attached to Salamence ex.'
  }];

  public set: string = 'DX';
  public setNumber: string = '103';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Salamence ex';
  public fullName: string = 'Salamence ex DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isSalamenceexInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isSalamenceexInPlay = true;
        }
      });

      if (!isSalamenceexInPlay) {
        return state;
      }

      if (!IS_POKEBODY_BLOCKED(store, state, player, this) && !active.tags.includes(CardTag.POKEMON_ex) && !active.tags.includes(CardTag.BABY)) {
        effect.cost = [];
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(40, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}