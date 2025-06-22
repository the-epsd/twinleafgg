import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PowerType } from '../../game';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Flareon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Self-healing',
    useWhenInPlay: false,
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [R] Energy card from your hand to Flareon, remove all Special Conditions affecting Flareon.'
  }];

  public attacks = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'The Defending Pokémon is now Burned.'
  },
  {
    name: 'Burn Booster',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Discard an Energy card attached to Flareon in order to use this attack. If the discarded card is a [R] Energy card, this attack does 40 damage plus 10 more damage.'
  }];

  public set: string = 'SK';
  public name: string = 'Flareon';
  public fullName: string = 'Flareon SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.energyCard.energyType === EnergyType.BASIC && effect.energyCard.provides.includes(CardType.FIRE)) {
        //remove special conditions
        const conditions = effect.target.specialConditions.slice();
        conditions.forEach(condition => {
          effect.target.removeSpecialCondition(condition);
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Make this acutally do the right thing later
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
      effect.damage += 10;
    }

    return state;
  }

}
