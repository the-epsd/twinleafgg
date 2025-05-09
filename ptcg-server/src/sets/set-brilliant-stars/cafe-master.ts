import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, GameError, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class CafeMaster extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name: string = 'Café Master';
  public fullName: string = 'Café Master BRS';

  public text: string =
    'Choose up to 3 of your Benched Pokémon. For each of those Pokémon, search your deck for a different type of basic Energy card and attach it to that Pokémon. Then, shuffle your deck. Your turn ends.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // return store.prompt(state, new ChoosePokemonPrompt(
      //   player.id,
      //   GameMessage.ATTACH_ENERGY_TO_BENCH,
      //   PlayerType.BOTTOM_PLAYER,
      //   [SlotType.BENCH, SlotType.ACTIVE],
      //   { min: 0, max: 2, blocked: blocked2 }
      // ), chosen => {

      //   chosen.forEach(target => {

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 3, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        if (transfers.length > 1) {
          const cardNames = new Set<string>();
          for (const transfer of transfers) {
            if (cardNames.has(transfer.card.name)) {
              throw new GameError(GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
            }
            cardNames.add(transfer.card.name);
          }
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
      });
      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      const playerActive = player.active.getPokemonCard();
      if (playerActive) {
        if (!(playerActive.fullName === 'Alcremie BRS') && !IS_ABILITY_BLOCKED(store, state, player, playerActive)) {
          const endTurnEffect = new EndTurnEffect(player);
          return store.reduceEffect(state, endTurnEffect);
        }
      }


    }
    return state;
  }
}