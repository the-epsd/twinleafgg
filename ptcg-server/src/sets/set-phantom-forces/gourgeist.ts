import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Gourgeist extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C, C, C];
  public evolvesFrom: string = 'Pumpkaboo';

  public powers = [{
    name: 'Gourgantic',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any [G] Energy attached to it, its maximum HP is 200.'
  }];

  public attacks = [{
    name: 'Horror Note',
    cost: [P, C, C],
    damage: 10,
    damageCalculation: 'x',
    text: ' This attack does 10 damage times the number of cards in your hand. '
  }];

  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Gourgeist';
  public fullName: string = 'Gourgeist PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let grassProvided = false;

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.GRASS)) {
          grassProvided = true;
        }
        if ((em.card.superType === SuperType.ENERGY && (em.card as EnergyCard).blendedEnergies.includes(CardType.GRASS)) ||
          (em.provides.includes(CardType.GRASS) || em.provides.includes(CardType.ANY))) {
          grassProvided = true;
        }
      });

      if (grassProvided) {
        effect.hp += 100;
        return state;
      }

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      effect.damage = player.hand.cards.length * 10;
    }

    return state;
  }
}