import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  ABILITY_USED,
  DRAW_CARDS,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Toucannon extends PokemonCard {
  // toucan,
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Trumbeak';
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sky Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw a card.',
  },];

  public attacks = [{
    name: 'Feather Rondo',
    cost: [C],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each Benched Pokémon in play (both yours and your opponent\'s).',
  }];

  public set: string = 'M5';
  public setNumber: string = '66';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toucannon';
  public fullName: string = 'Toucannon M5';

  public readonly SKY_DRAW_MARKER = 'M5_TOUCANNON_SKYDRAW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-sword-and-shield/cinccino.ts (marker once per turn), set-pitch-black/rampardos-ex.ts (once per turn prefabs)
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.SKY_DRAW_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.SKY_DRAW_MARKER, this);
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.SKY_DRAW_MARKER, this);
      DRAW_CARDS(store, state, player, 1);
      ABILITY_USED(player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SKY_DRAW_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let benches = player.bench.filter((b) => b.cards.length > 0).length;
      benches += opponent.bench.filter((b) => b.cards.length > 0).length;
      effect.damage += 20 * benches;
    }

    return state;
  }
}
