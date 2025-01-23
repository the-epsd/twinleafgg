import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class ArmarougeEX extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public evolvesFrom = 'Charcadet';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 260;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Crimson Armor',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, it takes 80 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Scorching Bazooka',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'This attack does 40 more damage for each [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PAR';

  public setNumber = '27';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'D';

  public name: string = 'Armarouge ex';

  public fullName: string = 'Armarouge ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crimson Armor
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // checking damage (it having no damage should confirm that this has full hp, no matter what its hp is set to)
      if (effect.target.damage === 0) {
        effect.damage -= 80;
      }
    }

    // Scorching Bazooka
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.FIRE || cardType === CardType.ANY;
        }).length;
      });

      effect.damage += energyCount * 40;
    }

    return state;
  }
}