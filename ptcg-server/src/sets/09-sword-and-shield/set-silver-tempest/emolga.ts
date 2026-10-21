import { CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Emolga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Lucky Find',
    cost: [C],
    damage: 0,
    text: 'Search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck.',
  },
  {
    name: 'Static Shock',
    cost: [L, C],
    damage: 40,
    text: '',
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Emolga';
  public fullName: string = 'Emolga SIT 54';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lucky Find
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        if (cards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }

        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        SHOW_CARDS_TO_PLAYER(store, state, StateUtils.getOpponent(state, player), cards);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
