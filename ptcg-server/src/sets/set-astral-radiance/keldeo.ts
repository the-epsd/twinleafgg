import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Keldeo extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Smash Kick',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Line Force',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each of your Benched Pokémon.'
    },
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public name: string = 'Keldeo';

  public fullName: string = 'Keldeo ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBench;

      effect.damage = 10 + (totalBenched * 20);
    }
    return state;
  }
}