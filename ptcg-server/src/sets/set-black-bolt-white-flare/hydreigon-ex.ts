import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, PlayerType } from '../../game';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hydreigonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Zweilous';
  public tags = [CardTag.POKEMON_ex];
  public cardType = D;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Greedy Eater',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from an attack this Pokémon uses, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Dark Bite',
    cost: [D, D, D, C, C],
    damage: 200,
    text: 'During your opponent\'s next turn, that Pokémon can\'t retreat.'
  }];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Hydreigon ex';
  public fullName: string = 'Hydreigon ex SV11W';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
      opponent.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      effect.player.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
          cardList.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
      });
    }

    if (effect instanceof KnockOutEffect && effect.target.isStage(Stage.BASIC)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Only during attack phase, and only if Hydreigon ex is attacking
      if (state.phase !== GamePhase.ATTACK || opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.prizeCount > 0) {
        effect.prizeCount += 1;
      }
    }
    return state;
  }
} 