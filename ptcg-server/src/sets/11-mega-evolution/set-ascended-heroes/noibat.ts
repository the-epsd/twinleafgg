import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import {SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Noibat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [N];
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Knickknack Carrying',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Pokémon Tool card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
{
    name: 'Bite',
    cost: [P, D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Noibat';
  public fullName: string = 'Noibat ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knickknack Carrying
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
      return state;
      } else {
      return store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      { min: 0, max: 1, allowCancel: true }
      ), selectedCards => {
      const cards = selectedCards || [];
      // Operation canceled by the user
      if (cards.length === 0) {
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      return state;
      });
      }
      cards.forEach((card, index) => {
      MOVE_CARDS(store, state, player.deck, player.hand, { cards: [card], sourceCard: this });
      });
      if (cards.length > 0) {
      SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
      }
      SHUFFLE_DECK(store, state, player);
      });
      }
    }

    return state;
  }
}
