import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, PlayerType, PowerType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public retreat = [C];

  public powers = [{
    name: 'Sealing Scream',
    powerType: PowerType.ABILITY,
    text: 'Each player can\'t play any ACE SPEC cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Hexed Mirror',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw a number of cards equal to the number of cards in your opponent\'s hand.'
  }];

  public set: string = 'LTR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb LTR';

  public readonly OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER = 'OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof PlayItemEffect && effect.trainerCard.tags.includes(CardTag.ACE_SPEC)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpiritombInPlay = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });

      if (!isSpiritombInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttachPokemonToolEffect && effect.trainerCard.tags.includes(CardTag.ACE_SPEC)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpiritombInPlay = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });

      if (!isSpiritombInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }


    if (effect instanceof AttachEnergyEffect && effect.energyCard.tags.includes(CardTag.ACE_SPEC)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpiritombInPlay = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });

      if (!isSpiritombInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }


    if (effect instanceof PlayStadiumEffect && effect.trainerCard.tags.includes(CardTag.ACE_SPEC)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpiritombInPlay = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });

      if (!isSpiritombInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, effect.opponent.hand.cards.length);
    }

    return state;
  }
}