import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// FCI Buzzwole 77 (https://limitlesstcg.com/cards/FLI/77)
export class Buzzwole extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ULTRA_BEAST];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Sledgehammer', cost: [CardType.FIGHTING], damage: 30, text: 'If your opponent has exactly 4 Prize cards remaining, this attack does 90 more damage.' },
    { name: 'Swing Around', cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS], damage: 80, text: 'Flip 2 coins. This attack does 20 more damage for each heads.' }
  ];

  public set: string = 'FLI';

  public name: string = 'Buzzwole';

  public fullName: string = 'Buzzwole FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() === 4) {
        effect.damage += 90;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }

}