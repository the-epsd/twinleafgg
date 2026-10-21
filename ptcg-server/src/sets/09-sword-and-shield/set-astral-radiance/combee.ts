import { CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Combee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Honey Courier',
    cost: [G],
    damage: 0,
    text: 'Search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck.',
  },
  {
    name: 'Bug Bite',
    cost: [C, C],
    damage: 20,
    text: '',
  }];

  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Combee';
  public fullName: string = 'Combee ASR 11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Honey Courier
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
