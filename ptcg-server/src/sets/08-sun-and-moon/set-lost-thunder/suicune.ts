import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  HEAL_X_DAMAGE_FROM_THIS_POKEMON,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Suicune extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 110;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Frozen Flow',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Aurora Gain',
    cost: [W, C, C],
    damage: 70,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Suicune';
  public fullName: string = 'Suicune LOT';

  public readonly FROZEN_FLOW_MARKER = 'FROZEN_FLOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Flow
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.FROZEN_FLOW_MARKER, this);
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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FROZEN_FLOW_MARKER, this);

    // Aurora Gain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    return state;
  }
}
