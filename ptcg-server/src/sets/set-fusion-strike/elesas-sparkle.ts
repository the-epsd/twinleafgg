import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, StateUtils } from '../../game';

export class ElesasSparkle extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'E';

  public tags = [CardTag.FUSION_STRIKE];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '233';

  public name: string = 'Elesa\'s Sparkle';

  public fullName: string = 'Elesa\'s Sparkle FST';

  public text: string =
    '';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.FUSION_STRIKE)) {
          blocked2.push(target);
        }
      });



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
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, name: 'Fusion Strike Energy' },
        { allowCancel: false, min: 0, max: 2, blockedTo: blocked2, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
      });
    }
    return state;
  }
}