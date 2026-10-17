import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { CardTarget, PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import {
  Card,
  GameError,
  GameMessage,
  PokemonCard,
  StoreLike,
  State,
  StateUtils,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { AttachEnergyPrompt } from '../../../game/store/prompts/attach-energy-prompt';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Rose,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const supporterTurn = player.supporterTurn;
  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Check if there is any basic Energy in discard
  const hasBasicEnergyInDiscard = player.discard.cards.some(
    (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
  );
  if (!hasBasicEnergyInDiscard) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Check if there is any VMAX Pokemon in play
  let hasVmax = false;
  const blockedTo: CardTarget[] = [];

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.cards.length === 0) {
      return;
    }
    const pokemon = cardList.getPokemonCard();
    if (pokemon instanceof PokemonCard && pokemon.hasTag(CardTag.POKEMON_VMAX)) {
      hasVmax = true;
    } else {
      blockedTo.push(target);
    }
  });

  if (!hasVmax) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [self], sourceCard: self });

  // Prompt to attach up to 2 basic energy from discard to 1 VMAX
  let attached: { to: CardTarget; card: Card }[] = [];
  yield store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.discard,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 0, max: 2, blockedTo, sameTarget: true },
    ),
    (transfers) => {
      attached = transfers || [];
      next();
    },
  );

  // If any energy was attached, discard hand
  if (attached.length > 0) {
    for (const transfer of attached) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: self });
    }

    // Discard entire hand
    const handCards = player.hand.cards.slice();
    handCards.forEach((c) => MOVE_CARDS(store, state, player.hand, player.discard, { cards: [c], sourceCard: self }));
  }

  MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [self], sourceCard: self });
  return state;
}

export class Rose extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '168';
  public name: string = 'Rose';
  public fullName: string = 'Rose DAA';
  public text: string =
    'Attach up to 2 basic Energy cards from your discard pile to 1 of your Pokémon VMAX. If you attached any Energy cards in this way, discard your hand. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const hasBasicEnergyInDiscard = player.discard.cards.some(
      (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
    );
    if (!hasBasicEnergyInDiscard) {
      return false;
    }

    let hasVmax = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.cards.length === 0) {
        return;
      }
      const pokemon = cardList.getPokemonCard();
      if (pokemon instanceof PokemonCard && pokemon.hasTag(CardTag.POKEMON_VMAX)) {
        hasVmax = true;
      }
    });

    if (!hasVmax) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
