import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Poochyena extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Continuous Steps',
      cost: [CardType.DARK],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip a coin until you get tails. This attack does 10 damage for each heads.'
    },
    {
      name: 'Darkness Fang',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Poochyena';

  public fullName: string = 'Poochyena TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let damage = 0;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          damage++;
          return this.reduceEffect(store, state, effect);
        }
        effect.damage = damage;
      });
    }
    return state;
  }
}