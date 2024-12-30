import { ChooseCardsPrompt, ShowCardsPrompt, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Floatzel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Buizel';

  public attacks = [
    {
      name: 'Floatify',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Put up to 2 Item cards from your discard pile into your hand.'
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'BRS';

  public name: string = 'Floatzel';

  public fullName: string = 'Floatzel BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const itemCount = player.discard.cards.filter(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
      }).length;

      if (itemCount === 0) {
        return state;
      }

      const max = Math.min(2, itemCount);

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
          { min: 1, max, allowCancel: false }
        )], selected => {
          const cards = selected || [];

          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            player.discard.moveCardsTo(cards, player.hand);
          });

          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          )], () => {
          });
        });
    }

    return state;
  }

}
