import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage } from '../../game';
import { REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Swadloon extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sewaddle';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Healing Leaves',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may heal 20 damage from your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Bug Buzz',
    cost: [G, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Swadloon';
  public fullName: string = 'Swadloon WHT';
  public readonly HEALING_LEAVES_MARKER = 'HEALING_LEAVES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.HEALING_LEAVES_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.HEALING_LEAVES_MARKER, this);

      const healEffect = new HealEffect(player, player.active, 20);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEALING_LEAVES_MARKER, this);

    return state;
  }
}