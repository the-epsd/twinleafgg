import { PokemonCard, StateUtils } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_DECK_EMPTY, MOVE_CARDS_TO_HAND, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TeamPlasmaBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public set: string = 'PLF';
  public name: string = 'Team Plasma Ball';
  public fullName: string = 'Team Plasma Ball PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';

  public text: string =
    'Search your deck for a Team Plasma Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      BLOCK_IF_DECK_EMPTY(player);

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.tags.includes(CardTag.TEAM_PLASMA))) {
          blocked.push(index);
        }
      });

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return state;
        }

        MOVE_CARDS_TO_HAND(store, state, player, cards);
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }

}
