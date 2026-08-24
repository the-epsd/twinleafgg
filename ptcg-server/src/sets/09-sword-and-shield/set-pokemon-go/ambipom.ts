import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GamePhase } from "../../../game";
import { PutDamageEffect } from "../../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { CoinFlipEffect } from "../../../game/store/effects/play-card-effects";
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, IS_ABILITY_BLOCKED } from "../../../game/store/prefabs/prefabs";


export class Ambipom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Aipom';
  public hp: number = 90;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Primate Dexterity',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Full Tilt Fling',
    cost: [C],
    damage: 60,
    damageCalculation: 'x',
    text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage for each heads.'
  }];

  public regulationMark = 'F';
  public set: string = 'PGO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Ambipom';
  public fullName: string = 'Ambipom PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primate Dexterity
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

    // Full Tilt Fling
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      // Count energy attached
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.length;
      if (energyCount === 0) {
        effect.damage = 0;
        return state;
      }
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, (results) => {
        const heads = results.filter((r) => r).length;
        effect.damage = 60 * heads;
      });
    }

    return state;
  }
}
