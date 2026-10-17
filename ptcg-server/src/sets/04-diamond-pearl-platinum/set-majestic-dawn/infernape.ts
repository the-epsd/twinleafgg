import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Infernape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Monferno';
  public hp: number = 110;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +30 }];
  public retreat = [];

  public attacks = [{
    name: 'Mach Punch',
    cost: [C],
    damage: 30,
    text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Mega Bravo',
    cost: [R],
    damage: 40,
    damageCalculation: 'x',
    text: 'Discard all Fire Energy attached to Infernape. This attack does 40 damage times the amount of Fire Energy you discarded.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Infernape';
  public fullName: string = 'Infernape MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mach Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    // Mega Bravo
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);
      const fireEnergy = checkProvidedEnergy.energyMap.filter(em =>
        em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)
      );
      effect.damage = 40 * fireEnergy.length;
      if (fireEnergy.length > 0) {
        const cards = fireEnergy.map(em => em.card);
        const discardEffect = new DiscardCardsEffect(effect, cards);
        discardEffect.target = player.active;
        store.reduceEffect(state, discardEffect);
      }
    }

    return state;
  }
}
