import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, PowerType } from '../../..';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
  SWITCH_ACTIVE_WITH_BENCHED,
} from '../../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardType: CardType[] = [CardType.DARK];

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Night Gate',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Nightmare',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 100,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public set = 'PAF';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar PAF';

  public readonly NIGHT_GATE_MARKER = 'NIGHT_GATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.NIGHT_GATE_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NIGHT_GATE_MARKER, this);

    // Night Gate
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.NIGHT_GATE_MARKER, this);
      ABILITY_USED(player, this);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    // Nightmare
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
