import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Liepard extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Purrloin';
  public cardType: CardType[] = [D];
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [D],
    damage: 40,
    text: ''
  }, {
    name: 'Shadow Scratch',
    cost: [D, C, C],
    damage: 90,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'UNM';
  public setNumber: string = '136';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Liepard';
  public fullName: string = 'Liepard UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shadow Scratch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
