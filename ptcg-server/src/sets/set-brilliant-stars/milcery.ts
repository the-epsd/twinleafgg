import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Milcery extends PokemonCard {
  public regulationMark: string = 'E';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Lead',
      cost: [P],
      damage: 0,
      text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Ram',
      cost: [P],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Milcery';
  public fullName: string = 'Milcery BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
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
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
