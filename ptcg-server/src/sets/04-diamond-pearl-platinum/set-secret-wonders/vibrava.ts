import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Trapinch';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sand Wind',
    cost: [F],
    damage: 0,
    text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
{
    name: 'Hyper Beam',
    cost: [F, C, C],
    damage: 40,
    text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    // Hyper Beam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
      if (result) {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
      }
      });
    }

    return state;
  }
}
