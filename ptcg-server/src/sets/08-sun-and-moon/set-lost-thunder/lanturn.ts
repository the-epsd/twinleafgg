import { PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { Stage, CardType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../../game/game-message';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import {
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chinchou';
  public hp: number = 110;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Salvage',
    cost: [C],
    damage: 0,
    text: 'Shuffle 4 Item cards from your discard pile into your deck.',
  },
  {
    name: 'Signal Beam',
    cost: [L, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Confused.',
  }];
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-destined-rivals/sacred-ash.ts (discard to deck + shuffle)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const itemCount = player.discard.cards.filter(
        c => c instanceof TrainerCard && c.trainerType === TrainerType.ITEM,
      ).length;

      if (itemCount === 0) {
        return state;
      }

      const count = Math.min(itemCount, 4);
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (!(c instanceof TrainerCard && c.trainerType === TrainerType.ITEM)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: count, max: count, allowCancel: false, blocked },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this, sourceEffect: effect });
        SHUFFLE_DECK(store, state, player);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
