import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Scrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scraggy';
  public cardType: CardType[] = [D];
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C, C],
    damage: 30,
    text: ''
  }, {
    name: 'Crushing Blow',
    cost: [D, D, C],
    damage: 70,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'DEX';
  public name: string = 'Scrafty';
  public fullName: string = 'Scrafty DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crushing Blow
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }

}
