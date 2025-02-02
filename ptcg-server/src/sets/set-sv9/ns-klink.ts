import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class NsKlink extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Double Spin',
      cost: [C],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 10 damage for each heads.'
    }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';

  public name: string = 'N\'s Klink';
  public fullName: string = 'N\'s Klink SV9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 10 * heads;
      });
    }
    return state;
  }

}