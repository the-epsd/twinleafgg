import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { PowerType } from '../../../game/store/card/pokemon-types';
import { GameError, GameMessage, PlayerType } from '../../../game';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { DRAW_CARDS, WAS_ATTACK_USED, WAS_POWER_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Bibarel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public regulationMark = 'F';
  public evolvesFrom = 'Bidoof';
  public cardType: CardType[] = [C];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Industrious Incisors',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw cards until you have 5 cards in your hand.'
  }];

  public attacks = [{
    name: 'Tail Smash',
    cost: [C, C, C],
    damage: 100,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Bibarel';
  public fullName: string = 'Bibarel BRS';

  public readonly INDUSTRIOUS_INCISORS_MARKER = 'INDUSTRIOUS_INCISORS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.INDUSTRIOUS_INCISORS_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.INDUSTRIOUS_INCISORS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.hand.cards.length >= 5) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      while (player.hand.cards.length < 5) {
        if (player.deck.cards.length === 0) {
          break;
        }
        DRAW_CARDS(store, state, player, 1);
      }

      player.marker.addMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}