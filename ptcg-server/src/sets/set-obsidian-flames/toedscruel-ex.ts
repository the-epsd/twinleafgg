import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { EnergyCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Toedscruelex extends PokemonCard {
  public regulationMark = 'G';
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toedscool';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 270;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Protective Mycelium',
    powerType: PowerType.ABILITY,
    text: ' Prevent all effects of attacks used by your opponent\'s Pokémon done to all of your Pokémon that have Energy attached. (Existing effects are not removed. Damage is not an effect.) '

  }];

  public attacks = [{
    name: 'Colony Rush',
    cost: [CardType.GRASS, CardType.GRASS],
    damage: 80,
    damageCalculation: '+',
    text: ' This attack does 40 more damage for each of your Benched Pokémon that has any [G] Energy attached. '
  }];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Toedscruel ex';
  public fullName: string = 'Toedscruel ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect) {
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard) {

        // eslint-disable-next-line indent
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        if (effect.target.cards.some(c => c instanceof EnergyCard)) {

          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const player = StateUtils.findOwner(state, effect.target);
            const stub = new PowerEffect(player, {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: ''
            }, this);
            store.reduceEffect(state, stub);
          } catch {
            return state;
          }

          effect.preventDefault = true;
        }

      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokesWithGrass = 0;

      player.bench.forEach((cardList, card) => {

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        let hasGrass = false;
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          if (energy.provides.some(type => type === CardType.GRASS)) {
            hasGrass = true;
          }
        });

        if (hasGrass) {
          pokesWithGrass++;
        }

      });

      effect.damage += pokesWithGrass * 40;
      return state;
    }

    return state;
  }
}