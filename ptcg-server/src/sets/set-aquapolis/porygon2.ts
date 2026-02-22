import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, BLOCK_IF_HAS_SPECIAL_CONDITION, DRAW_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Porygon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Porygon';
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Backup',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during each of your turns (before your attack), if you have 2 or fewer cards in your hand, you may draw cards from your deck until you have 3 cards in your hand. This power can\'t be used if Porygon2 is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Hypnotic Ray',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Porygon2';
  public fullName: string = 'Porygon2 AQ';

  public readonly BACKUP_MARKER = 'BACKUP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BACKUP_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.BACKUP_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.BACKUP_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.hand.cards.length >= 3) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      while (player.hand.cards.length < 3) {
        if (player.deck.cards.length === 0) {
          break;
        }
        DRAW_CARDS(player, 1);
      }
      player.marker.addMarker(this.BACKUP_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }

}
