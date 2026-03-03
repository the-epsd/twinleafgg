import { PokemonCard, Stage, CardType, StoreLike, State, GameError, GameMessage, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Xatu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Natu';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Healing Wind',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Active Pokémon. This power can\'t be used if Xatu is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Psyimpact',
    cost: [P, C],
    damage: 0,
    text: 'Put 1 damage counter on each of your opponent\'s Pokémon.'
  }];

  public set: string = 'SS';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Xatu';
  public fullName: string = 'Xatu SS';

  public readonly HEALING_WIND_MARKER = 'HEALING_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Healing Wind Poké-Power
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.HEALING_WIND_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      ABILITY_USED(player, this);
      ADD_MARKER(this.HEALING_WIND_MARKER, player, this);

      const target = player.active;
      const healEffect = new HealEffect(player, target, 10);
      state = store.reduceEffect(state, healEffect);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEALING_WIND_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(1, store, state, effect);
    }

    return state;
  }
} 