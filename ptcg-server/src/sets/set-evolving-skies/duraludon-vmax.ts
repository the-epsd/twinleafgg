import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyCard } from '../../game';
import { AfterDamageEffect, ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';


export class DuraludonVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE ];

  public evolvesFrom = 'Duraludon V';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 330;

  public weakness = [];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Skyscraper',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokemon by attacks ' +
      'from your opponent\'s Pokémon that have Special Energy ' +
      'attached.'
  }];

  public attacks = [{
    name: 'G-Max Pulverization',
    cost: [ CardType.FIGHTING, CardType.METAL, CardType.METAL ],
    damage: 220,
    text: 'This attack\'s damage isn\'t affected by any effects on your ' +
      'opponent\'s Active Pokémon.'
  }];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Duraludon VMAX';

  public fullName: string = 'Duraludon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 220);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentPokemon = opponent.active;

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponentPokemon);
      store.reduceEffect(state, checkEnergy);


      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard &&
          energyCard.energyType === EnergyType.SPECIAL) {

          if (effect instanceof PutDamageEffect
            && opponent.active.cards.includes(energyCard)) {
            effect.preventDefault = true;
            return state;
          }
        }

      });
    }
    return state;
  }

}
