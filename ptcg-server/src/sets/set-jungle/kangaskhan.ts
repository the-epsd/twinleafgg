import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kangaskhan extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Fetch',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Comet Punch',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name: string = 'Kangaskhan';

  public fullName: string = 'Kangaskhan JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      if (player.deck.cards.length > 0) {
        player.deck.moveTo(player.hand, 1);
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 20 * heads;
      });
      return state;
    }

    return state;
  }

}