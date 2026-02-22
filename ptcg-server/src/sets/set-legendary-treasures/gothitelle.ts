import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gothitelle extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gothorita';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Magic Room',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, your opponent can\'t play any Item cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Madkinesis',
    cost: [C, C, C],
    damage: 30,
    text: 'Does 20 more damage for each [P] Energy attached to this Pokémon.'
  }];

  public set: string = 'LTR';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gothitelle';
  public fullName: string = 'Gothitelle LTR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let psychicEnergies = 0;
      checkProvidedEnergyEffect.energyMap.forEach(energy => {
        energy.provides.forEach(c => {
          psychicEnergies += c === CardType.PSYCHIC ? 1 : 0;
        });
      });

      effect.damage += 20 * psychicEnergies;
      return state;
    }

    // Block trainer cards
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      // Gothitelle is not Active Pokemon
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }

}
