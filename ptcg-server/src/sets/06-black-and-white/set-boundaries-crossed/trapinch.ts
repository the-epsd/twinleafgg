import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Trapinch extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smithereen Smash',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  }, {
    name: 'Hyper Beam',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public name: string = 'Trapinch';
  public fullName: string = 'Trapinch BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Smithereen Smash
    if (WAS_ATTACK_USED(effect, 0, this)) {
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
