import { PokemonCard, Stage, CardType, StoreLike, State, GameError, GameMessage, StateUtils, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Comfey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 70;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flower Shower',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Each player draws 3 cards.'
    },
    {
      name: 'Play Rough',
      cost: [CardType.PSYCHIC],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Comfey';
  public fullName: string = 'Comfey SV7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      player.deck.moveTo(player.hand, 3);
      opponent.deck.moveTo(opponent.hand, 3);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }

}
