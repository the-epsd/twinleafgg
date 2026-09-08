import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Pangoro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pancham';
  public cardType: CardType[] = [D];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Parting Shot',
    cost: [D],
    damage: 10,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon. During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 60 (before applying Weakness and Resistance).'
  },
  {
    name: 'Buster Swing',
    cost: [D, D, D],
    damage: 90,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pangoro';
  public fullName: string = 'Pangoro BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Parting Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 60);
    }
    // Switch self after damage
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    // Buster Swing
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
