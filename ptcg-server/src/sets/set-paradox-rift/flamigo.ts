import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Flamigo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck',
    cost: [F],
    damage: 30,
    text: ''
  },
  {
    name: 'Combat Beak',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public set = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name = 'Flamigo';
  public fullName = 'Flamigo PAR';
  public regulationMark = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 20 * opponentBench);
    }

    return state;
  }

}