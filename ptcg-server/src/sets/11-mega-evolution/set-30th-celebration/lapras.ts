import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, SuperType, TrainerType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, SHOW_CARDS_TO_PLAYER, MOVE_CARDS, SHUFFLE_DECK, COIN_FLIP_PROMPT } from "../../../game/store/prefabs/prefabs";

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ferry Across',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Ice Beam',
    cost: [W, C, C],
    damage: 80,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ferry Across
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Ice Beam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
