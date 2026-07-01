import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Mightyena extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poochyena';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Hunting Pack',
    cost: [D],
    damage: 30,
    damageCalculation: '+',
    text: 'If Mightyena is on your Bench, this attack does 90 more damage.'
  },
  {
    name: 'Corner',
    cost: [D, C],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Mightyena';
  public fullName: string = 'Mightyena TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
      const mightyenasOnBench = benchPokemon.filter(card => card.name === 'Mightyena');

      if (mightyenasOnBench.length > 0) {
        effect.damage += 90;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }

}
