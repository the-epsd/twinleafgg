import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class GougingFire extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Knock Down',
      cost: [CardType.FIRE],
      damage: 30,
      text: ''
    },
    {
      name: 'Blazing Assault',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If your opponent has 4 or fewer prizes left, this attack does 70 more damage.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '38';

  public name: string = 'Gouging Fire';

  public fullName: string = 'Gouging Fire SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentPrizes = opponent.prizes.length;

      if (opponentPrizes <= 4) {
        effect.damage += 70;
      }
    }

    return state;
  }
}