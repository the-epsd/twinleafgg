import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  public hp: number = 140;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hyper Beam',
    cost: [C, C, C],
    damage: 40,
    text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
  },
  {
    name: 'Draco Meteor',
    cost: [C, C, C, C],
    damage: 0,
    text: 'Flip a coin for each of your opponent\'s Pokémon. If that coin flip is heads, this attack does 50 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hyper Beam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
      if (result) {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
      }
      });
    }

    // Draco Meteor
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
