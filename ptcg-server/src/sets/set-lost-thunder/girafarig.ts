import { PokemonCard, Stage, CardType, Resistance, StoreLike, State, StateUtils, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Girafarig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 90;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance: Resistance[] = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Get Lost',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Put 2 cards from your opponent\'s discard pile in the Lost Zone.'
    },
    {
      name: 'Mind Shock',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public name: string = 'Girafarig';

  public fullName: string = 'Girafarig LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Get Lost
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.discard,
        {},
        { min: 2, max: 2 }
      ), selected => {
        if (selected && selected.length === 2) {
          selected.forEach(card => {
            opponent.discard.moveCardsTo(selected, player.lostzone);
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Mind Shock
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
    }
    return state;
  }
}