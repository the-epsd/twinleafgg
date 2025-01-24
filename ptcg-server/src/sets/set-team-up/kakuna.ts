import { CardType, GamePhase, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class KakunaTEU extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Weedle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set = 'TEU';

  public setNumber = '4';

  public cardImage = 'assets/cardback.png';

  public name = 'Kakuna';

  public fullName = 'Kakuna TEU';

  public powers = [
    {
      name: 'Grass Cushion',
      powerType: PowerType.ABILITY,
      text: 'If this Pokemon has any G Energy attached to it, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public attacks = [{ name: 'Bug Bite', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: '' }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Grass Cushion
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const target = effect.target;

      // It's not an attack, or not targeting this Pokemon
      if (target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) { return state; }

      // Check if we're holding a Grass energy
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, target);
      store.reduceEffect(state, checkProvidedEnergy);
      const enoughEnergies = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, [CardType.GRASS]);
      if (!enoughEnergies) { return state; }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch { return state; }

      // Now do the damage reduction
      effect.damage -= 60;
    }

    return state;
  }
}