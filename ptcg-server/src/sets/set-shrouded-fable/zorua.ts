import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Zorua extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stampede',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Double Scratch',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage for each heads.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Zorua';

  public fullName: string = 'Zorua SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = heads * 20;
      });
    }
    return state;
  }

}