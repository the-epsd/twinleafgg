import { Card, CardList, GameMessage, PlayerType, PokemonCard, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import {
  ADD_MARKER,
  CONFIRMATION_PROMPT,
  HAS_MARKER,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export const BLOW_AWAY_BOMB_MARKER = 'BLOW_AWAY_BOMB_MARKER';

/**
 * DiscardCardsEffect extends AbstractAttackEffect, whose constructor expects an
 * AttackEffect (with opponent, attack, source). TrainerEffect lacks those fields,
 * so we build the effect manually to avoid crashing on opponent.active.
 */
export function createTrainerDiscardCardsEffect(
  state: State,
  sourceEffect: TrainerEffect,
  cards: Card[],
  from: CardList,
): DiscardCardsEffect {
  const player = sourceEffect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const discardEffect = Object.create(DiscardCardsEffect.prototype) as DiscardCardsEffect;
  discardEffect.preventDefault = false;
  discardEffect.cards = cards;
  discardEffect.attackEffect = sourceEffect as any;
  discardEffect.player = player;
  discardEffect.opponent = opponent;
  discardEffect.target = from as any;

  return discardEffect;
}

export function reduceBlowAwayBombEffect(
  store: StoreLike,
  state: State,
  effect: Effect,
  card: PokemonCard,
): State {
  if (effect instanceof EndTurnEffect) {
    REMOVE_MARKER_AT_END_OF_TURN(effect, BLOW_AWAY_BOMB_MARKER, card);
    return state;
  }

  if (!(effect instanceof DiscardCardsEffect) || !effect.cards.includes(card)) {
    return state;
  }

  const source = effect.attackEffect;
  if (!(source instanceof TrainerEffect) || source.trainerCard.name !== 'Roxie') {
    return state;
  }

  const player = effect.player;
  if (IS_ABILITY_BLOCKED(store, state, player, card) || HAS_MARKER(BLOW_AWAY_BOMB_MARKER, player, card)) {
    return state;
  }

  const opponent = StateUtils.getOpponent(state, player);
  const power = card.powers.find(p => p.name === 'Blow-Away Bomb');
  if (!power) {
    return state;
  }

  CONFIRMATION_PROMPT(store, state, player, result => {
    if (!result) {
      return;
    }

    ADD_MARKER(BLOW_AWAY_BOMB_MARKER, player, card);
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
      const effectOfAbility = new EffectOfAbilityEffect(player, power, card, cardList);
      effectOfAbility.target = cardList;
      store.reduceEffect(state, effectOfAbility);
      if (effectOfAbility.target) {
        cardList.damage += 10;
      }
    });
  }, GameMessage.WANT_TO_USE_ABILITY);

  return state;
}
