import { CardType, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyPrompt } from '../../../game/store/prompts/attach-energy-prompt';
import {
  CardTarget,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AquaPatch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';
  public name: string = 'Aqua Patch';
  public fullName: string = 'Aqua Patch GRI';
  public text: string =
    'Attach a [W] Energy card from your discard pile to 1 of your Benched [W] Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need a [W] Energy card in the discard pile
    const hasEnergyInDiscard = player.discard.cards.some(
      (c) =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.WATER),
    );
    if (!hasEnergyInDiscard) {
      return false;
    }

    // Need a Benched [W] Pokémon
    return player.bench.some((bench) => {
      if (bench.cards.length === 0) {
        return false;
      }
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
      store.reduceEffect(state, checkPokemonTypeEffect);
      return checkPokemonTypeEffect.cardTypes.includes(CardType.WATER);
    });
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(
        (c) =>
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.WATER),
      );

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasWaterPokemonOnBench = false;
      const blockedTo: CardTarget[] = [];
      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.WATER)) {
          hasWaterPokemonOnBench = true;
        } else {
          blockedTo.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      if (!hasWaterPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: true, min: 1, max: 1, blockedTo },
        ),
        (transfers) => {
          transfers = transfers || [];

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.discard, target, {
              cards: [transfer.card],
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
