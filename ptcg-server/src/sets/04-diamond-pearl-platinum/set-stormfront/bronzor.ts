import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public resistance = [{ type: R, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gyro Swap',
    cost: [P],
    damage: 0,
    text: 'Put a number of damage counters on the Defending Pokémon equal to the number of Colorless Energy in Bronzor\'s Retreat Cost (after applying effects to the Retreat Cost).'
  },
  {
    name: 'Psyshock',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gyro Swap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkRetreat = new CheckRetreatCostEffect(player);
      store.reduceEffect(state, checkRetreat);
      const colorlessCount = checkRetreat.cost.filter(c => c === CardType.COLORLESS).length;
      if (colorlessCount > 0) {
        store.reduceEffect(state, new PlaceDamageCountersEffect(
          player,
          opponent.active,
          colorlessCount * 10,
          this,
        ));
      }
    }

    // Psyshock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
