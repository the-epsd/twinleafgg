import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
  SWITCH_ACTIVE_WITH_BENCHED,
} from '../../../game/store/prefabs/prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';

export class Hatterene extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Hattrem';
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Witch Rondo',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches their Active Pokémon with 1 of their Benched Pokémon.',
  }];

  public attacks = [{
    name: 'Psychic',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Energy attached to your opponent\'s Active Pokémon.',
  }];

  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Hatterene';
  public fullName: string = 'Hatterene CRE';

  public readonly WITCH_RONDO_MARKER = 'HATTERENE_CRE_WITCH_RONDO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Witch Rondo
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!player.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.WITCH_RONDO_MARKER, this);
      ABILITY_USED(player, this);

      const opponent = StateUtils.getOpponent(state, player);

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      if (opponent.bench.some(b => b.cards.length > 0)) {
        return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          { allowCancel: false },
        );
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.WITCH_RONDO_MARKER, this);

    // Psychic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      effect.damage += 50 * energyCount;
    }

    return state;
  }
}
