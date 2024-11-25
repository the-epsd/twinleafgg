import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, GameLog, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Fennekin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Lead',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: ' Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck. '
  },
  {
    name: 'Live Coal',
    cost: [CardType.FIRE],
    damage: 10,
    text: ''
  }];

  public set: string = 'SIT';
  public setNumber: string = '25';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fennekin';
  public fullName: string = 'Fennekin SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          )], () => {

            cards.forEach((card, index) => {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });

            player.deck.moveCardsTo(cards, player.hand);
          });
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}