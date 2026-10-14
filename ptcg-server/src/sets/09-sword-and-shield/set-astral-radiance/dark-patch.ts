import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { CardTarget, PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { AttachEnergyPrompt, Player, StateUtils } from '../../../game';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';

export class DarkPatch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Dark Patch';
  public fullName: string = 'Dark Patch ASR';
  public text: string =
    'Attach a basic [D] Energy card from your discard pile to 1 of your ' + 'Benched [D] Pokemon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasEnergyInDiscard = player.discard.cards.some((c) => {
      return (
        c.superType === SuperType.ENERGY &&
        c.energyType === EnergyType.BASIC &&
        (c as EnergyCard).provides.includes(CardType.DARK)
      );
    });
    if (!hasEnergyInDiscard) {
      return false;
    }

    let hasDarkPokemonOnBench = false;
    player.bench.forEach((bench) => {
      if (bench.cards.length === 0) {
        return;
      }
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
        hasDarkPokemonOnBench = true;
      }
    });

    if (!hasDarkPokemonOnBench) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some((c) => {
        return (
          c.superType === SuperType.ENERGY &&
          c.energyType === EnergyType.BASIC &&
          (c as EnergyCard).provides.includes(CardType.DARK)
        );
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasDarkPokemonOnBench = false;
      const blockedTo: CardTarget[] = [];
      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
          hasDarkPokemonOnBench = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index,
          };
          blockedTo.push(target);
        }
      });

      if (!hasDarkPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
          { allowCancel: false, min: 1, max: 1, blockedTo },
        ),
        (transfers) => {
          transfers = transfers || [];

          if (transfers.length === 0) {
            return;
          }

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
