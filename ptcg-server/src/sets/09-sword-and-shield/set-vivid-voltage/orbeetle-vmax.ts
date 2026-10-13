import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';

export class OrbeetleVmax extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom: string = 'Orbeetle V';
  protected _tags = [CardTag.POKEMON_VMAX];
  public hp: number = 310;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Eerie Beam',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: "Once during your turn, if this Pokémon is in the Active Spot, you may put 1 damage counter on each of your opponent's Pokémon.",
  }];

  public attacks = [{
    name: 'G-Max Wave',
    cost: [G, C],
    damage: 50,
    damageCalculation: '+',
    text: "This attack does 50 more damage for each Energy attached to your opponent's Active Pokémon.",
  }];

  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Orbeetle VMAX';
  public fullName: string = 'Orbeetle VMAX VIV';

  public readonly EERIE_BEAM_MARKER = 'ORBEETLE_VMAX_VIV_EERIE_BEAM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eerie Beam
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.EERIE_BEAM_MARKER, this);
      ABILITY_USED(player, this);

      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.cards.length > 0) {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
          );
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.EERIE_BEAM_MARKER, this);

    // G-Max Wave
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
