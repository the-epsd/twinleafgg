import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Alakazamex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kadabra';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mind Jack',
      cost: [C, C],
      damage: 90,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Dimensional Manipulation',
      cost: [P, P],
      damage: 120,
      useOnBench: true,
      text: 'You may use this attack even if this Pokemon is on the Bench.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alakazam ex';
  public fullName: string = 'Alakazam ex MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      effect.damage += opponentBenched * 30;
    }
    return state;
  }
}