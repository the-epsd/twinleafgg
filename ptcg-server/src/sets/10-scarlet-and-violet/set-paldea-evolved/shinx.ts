import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  WAS_POWER_USED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';

export class Shinx extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Big Roar',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx PAL';

  public readonly BIG_ROAR_MARKER = 'BIG_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BIG_ROAR_MARKER, this);

    // Big Roar — Ref: set-paradox-rift/iron-bundle.ts (SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.BIG_ROAR_MARKER, this);
      ABILITY_USED(player, this);

      return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }
    return state;
  }
}
