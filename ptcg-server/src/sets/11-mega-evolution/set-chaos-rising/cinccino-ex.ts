import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { GamePhase } from '../../../game/store/state/state';
import { PokemonCard, StoreLike, State } from '../../../game';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CoinFlipEffect } from '../../../game/store/effects/play-card-effects';

export class Cinccinoex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 240;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Smooth Coat',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.',
  }];

  public attacks = [{
    name: 'Energized Slap',
    cost: [C],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each Energy attached to this Pokémon.',
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Cinccino ex';
  public fullName: string = 'Cinccino ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smooth Coat
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.damage <= 0) {
        return state;
      }

      const coinFlip = new CoinFlipEffect(player);
      store.reduceEffect(state, coinFlip);

      if (coinFlip.result === false) {
        return state;
      }

      effect.preventDefault = true;
      return state;
    }
    // Energized Slap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const source = effect.source;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, source);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyProvided = checkProvidedEnergy.energyMap
        .reduce((sum, em) => sum + (em.provides?.length ?? 0), 0);

      effect.damage = 40 * energyProvided;
    }

    return state;
  }
}
