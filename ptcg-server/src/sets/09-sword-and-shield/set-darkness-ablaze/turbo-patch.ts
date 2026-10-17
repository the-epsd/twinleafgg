import { TrainerCard } from '../../../game/store/card/trainer-card';
import {
  CardTag,
  EnergyType,
  Stage,
  SuperType,
  TrainerType,
} from '../../../game/store/card/card-types';
import { CardTarget, PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { GameError, GameMessage, StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { AttachEnergyPrompt } from '../../../game/store/prompts/attach-energy-prompt';
import { StateUtils } from '../../../game/store/state-utils';
import { COIN_FLIP_PROMPT, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TurboPatch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '172';
  public name: string = 'Turbo Patch';
  public fullName: string = 'Turbo Patch DAA';
  public text: string =
    "Flip a coin. If heads, attach a basic Energy card from your discard pile to 1 of your Basic Pokémon that isn't a Pokémon-GX. You may play any number of Item cards during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasBasicEnergyInDiscard = player.discard.cards.some(
      (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
    );
    if (!hasBasicEnergyInDiscard) {
      return false;
    }

    let hasValidTarget = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (cardList.cards.length === 0) {
        return;
      }
      const pokemon = cardList.getPokemonCard();
      const isBasicNonGX =
        pokemon && pokemon.stage === Stage.BASIC && !pokemon.hasTag(CardTag.POKEMON_GX);

      if (isBasicNonGX) {
        hasValidTarget = true;
      }
    });

    if (!hasValidTarget) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check preconditions
      const hasBasicEnergyInDiscard = player.discard.cards.some(
        (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );
      if (!hasBasicEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if there are valid Basic non-GX Pokemon in play
      let hasValidTarget = false;
      const blockedTo: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.length === 0) {
          return;
        }
        const pokemon = cardList.getPokemonCard();
        const isBasicNonGX =
          pokemon && pokemon.stage === Stage.BASIC && !pokemon.hasTag(CardTag.POKEMON_GX);

        if (isBasicNonGX) {
          hasValidTarget = true;
        } else {
          blockedTo.push(target);
        }
      });

      if (!hasValidTarget) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [this], sourceCard: this });

      state = COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (!result) {
          // Tails - no effect, just discard trainer
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this], sourceCard: this });
          return;
        }

        // Heads - attach basic energy to Basic non-GX Pokemon
        state = store.prompt(
          state,
          new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 1, max: 1, blockedTo },
          ),
          (transfers) => {
            transfers = transfers || [];

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
            }

            MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this], sourceCard: this });
          },
        );
      });
    }

    return state;
  }
}
