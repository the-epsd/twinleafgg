import {
  CardTarget,
  PlayerType,
  SlotType,
  StateUtils,
  StoreLike,
  State,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { Effect } from '../../../game/store/effects/effect';
import { MarkerConstants } from '../../../game/store/markers/marker-constants';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { CLEAN_UP_SUPPORTER } from '../../../game/store/prefabs/prefabs';

export class RustSyndicateGrunt extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'J';
  public set: string = 'M5';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rust Syndicate Grunt';
  public fullName: string = 'Rust Syndicate Grunt M5';
  public text: string = `You may only play this card if 1 of your Pokémon was Knocked Out during your opponent\'s last turn.\n\nDiscard 1 Energy attached to 1 of your opponent\'s Pokémon.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return playRust(store, state, effect, this);
    }
    return state;
  }
}

function playRust(store: StoreLike, state: State, effect: TrainerEffect, _self: RustSyndicateGrunt): State {
  const player = effect.player;

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const otherCards = player.hand.cards.filter(c => c !== effect.trainerCard);
  if (otherCards.length > 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (!player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const opponent = StateUtils.getOpponent(state, player);

  const blocked: CardTarget[] = [];
  let anyEnergy = false;
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
    if (cardList.energies.cards.length > 0) {
      anyEnergy = true;
    }
  });

  if (!anyEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.energies.cards.length === 0) {
      blocked.push(target);
    }
  });

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked },
  ), targets => {
    const tgt = targets && targets[0];
    if (!tgt) {
      CLEAN_UP_SUPPORTER(store, effect, player);
      return state;
    }
    return store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      tgt.energies,
      {},
      { min: 1, max: 1, allowCancel: false },
    ), sel => {
      tgt.moveCardsTo(sel || [], opponent.discard);
      CLEAN_UP_SUPPORTER(store, effect, player);
      return state;
    });
  });
}
