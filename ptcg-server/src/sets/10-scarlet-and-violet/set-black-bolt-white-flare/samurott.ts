import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  SWITCH_ACTIVE_WITH_BENCHED,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';

export class Samurott extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dewott';
  public hp: number = 160;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Strong Currents',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokemon. If you do, your opponent switches their Active Pokemon with 1 of their Benched Pokemon.',
  }];

  public attacks = [{
    name: 'Energy Slash',
    cost: [W],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Energy attached to this Pokemon.',
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Samurott';
  public fullName: string = 'Samurott SV11W';

  public readonly STRONG_CURRENTS_MARKER = 'STRONG_CURRENTS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.STRONG_CURRENTS_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.STRONG_CURRENTS_MARKER, this);

    // Strong Currents
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!player.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.STRONG_CURRENTS_MARKER, this);
      ABILITY_USED(player, this);

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }

    // Energy Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 30 + (50 * energyCount);
    }

    return state;
  }
}
