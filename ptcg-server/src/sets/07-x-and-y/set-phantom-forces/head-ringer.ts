import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, CardType, TrainerType } from '../../../game/store/card/card-types';
import {
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  StoreLike,
  State,
  StateUtils,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { PlayItemEffect } from '../../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { IS_TOOL_BLOCKED, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class HeadRinger extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Head Ringer';
  public fullName: string = 'Head Ringer Team Flare Hyper Gear PHF';
  public text: string =
    "Attach this Pokemon Tool to 1 of your opponent's Pokemon-EX that doesn't already have a Pokemon Tool attached to it.\n\nThe attacks of the Pokémon this card is attached to cost [C] more.\n\nWhen this card is removed from a Pokémon for any reason, put this card in its owner's discard pile.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);

    let hasValidTarget = false;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
      if (card.hasTag(CardTag.POKEMON_EX) && cardList.tools.length === 0) {
        hasValidTarget = true;
      }
    });

    return hasValidTarget;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attach to one of the opponent's Pokemon-EX instead of the normal item flow
    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Prevent default item discard behavior
      effect.preventDefault = true;

      // Block everything except Pokemon-EX without a Tool
      const blocked: { player: PlayerType; slot: SlotType; index: number }[] = [];
      const opponentActivePokemon = opponent.active.getPokemonCard();

      if (
        !opponentActivePokemon ||
        !opponentActivePokemon.hasTag(CardTag.POKEMON_EX) ||
        opponent.active.tools.length > 0
      ) {
        blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }

      opponent.bench.forEach((benchSlot, index) => {
        const pokemonCard = benchSlot.getPokemonCard();
        if (!pokemonCard || !pokemonCard.hasTag(CardTag.POKEMON_EX) || benchSlot.tools.length > 0) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (targets) => {
          if (targets && targets.length > 0) {
            const target = targets[0];
            MOVE_CARDS(store, state, player.hand, target, { cards: [this], sourceCard: this });

            // Tools live in tools[], not cards[]
            const cardIndex = target.cards.indexOf(this);
            if (cardIndex !== -1) {
              target.cards.splice(cardIndex, 1);
            }
            target.tools.push(this);
          }
        },
      );
    }

    // The attacks of the Pokemon this is attached to cost [C] more
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (!player.active.tools.includes(this)) {
        return state;
      }

      if (IS_TOOL_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.cost.push(CardType.COLORLESS);
    }

    return state;
  }
}
