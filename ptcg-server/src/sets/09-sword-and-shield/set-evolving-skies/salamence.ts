import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shelgon';
  public hp: number = 170;
  public cardType: CardType[] = [N];
  public retreat = [C, C];

  public powers = [{
    name: 'Intimidating Roar',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.',
  }];

  public attacks = [{
    name: 'Fierce Dragon',
    cost: [R, W],
    damage: 100,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 120 more damage.',
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence EVS';

  public readonly INTIMIDATING_ROAR_MARKER = 'SALAMENCE_EVS_INTIMIDATING_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intimidating Roar
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.INTIMIDATING_ROAR_MARKER, this);
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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.INTIMIDATING_ROAR_MARKER, this);

    // Fierce Dragon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.damage > 0) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
