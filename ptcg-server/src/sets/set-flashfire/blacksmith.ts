import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { PlayerType, SlotType, CardTarget } from '../../game/store/actions/play-card-action';

export class Blacksmith extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FLF';

  public name: string = 'Blacksmith';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public fullName: string = 'Blacksmith FLF';

  public text: string =
    'Attach 2 [R] Energy cards from your discard pile to 1 of your [R] Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const fireEnergyCount = player.discard.cards.filter(c =>
        c instanceof EnergyCard
        && c.energyType === EnergyType.BASIC
        && c.provides.includes(CardType.FIRE)
      ).length;

      if (fireEnergyCount < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }


      let hasFirePokemon = false;
      const blockedTo: CardTarget[] = [];
      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) {
          hasFirePokemon = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (!hasFirePokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // Do not discard the card yet
      effect.preventDefault = true;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, min: 2, max: 2, blockedTo, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);

      });
    }

    return state;
  }

}
