import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Gimmighoul2 extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 70;

  public weakness = [{ type: D }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Continuous Coin Toss',
      cost: [C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public name: string = 'Gimmighoul';

  public fullName: string = 'Gimmighoul2 PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let heads = 0;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          heads++;
          return this.reduceEffect(store, state, effect);
        }
        effect.damage = heads * 20;
      });
    }
    return state;
  }
}