import { State, StoreLike } from '../../game';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Paras';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sleep Pinchers',
    cost: [G, G],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'N3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Parasect';
  public fullName: string = 'Parasect N3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          addSpecialCondition.target = opponent.active;
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }
}
