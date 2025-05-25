import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class DarkTyranitar2 extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dark Pupitar';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Grind',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'Does 10 damage plus 10 more damage for each Energy attached to Dark Tyranitar.'
    },
    {
      name: 'Spinning Tail',
      cost: [D, C, C],
      damage: 0,
      text: 'Does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Bite Off',
      cost: [D, D, C, C, C],
      damage: 70,
      damageCalculation: '+',
      text: 'If the Defending Pokémon is Pokémon-ex, this attack does 70 damage plus 50 more damage.'
    }
  ];

  public set: string = 'TRR';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Tyranitar';
  public fullName: string = 'Dark Tyranitar TRR 19';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Grind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const damagePerEnergy = 10;
      effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
    }

    // Spinning Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 20);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    // Bite Off
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const defending = effect.opponent.active;

      if (defending && defending.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 50;
      }
    }

    return state;
  }
} 