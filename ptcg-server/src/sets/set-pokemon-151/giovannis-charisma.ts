import { Card } from '../../game/store/card/card';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt, EnergyCard, GameError, PlayerType, SlotType, StateUtils } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let card: Card;
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    card = selected[0];

    opponent.active.moveCardTo(card, opponent.hand);

    state = store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_BENCH,
      player.hand,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE],
      { superType: SuperType.ENERGY },
      { allowCancel: true, min: 0, max: 1 }
    ), transfers => {
      transfers = transfers || [];

      if (transfers.length === 0) {
        return;
      }

      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.hand.moveCardTo(transfer.card, target);
      }
    });

    player.supporter.moveCardTo(effect.trainerCard, player.discard);

    return state;
  });
}

export class GiovannisCharisma extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '161';

  public name: string = 'Giovanni\'s Charisma';

  public fullName: string = 'Giovanni\'s Charisma MEW';

  public text: string =
    'Put an Energy attached to your opponent\'s Active Pokémon into their hand. If you do, attach an Energy card from your hand to your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
