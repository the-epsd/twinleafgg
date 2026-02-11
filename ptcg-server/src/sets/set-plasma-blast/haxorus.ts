import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckHpEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Fraxure';
  public cardType: CardType = N;
  public hp: number = 140;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dragonaxe',
      cost: [M],
      damage: 40,
      damageCalculation: 'x' as 'x',
      text: 'Does 40 damage times the amount of [M] Energy attached to this Pokémon.'
    },
    {
      name: 'Strike of the Champion',
      cost: [F, M],
      damage: 0,
      text: 'If the Defending Pokémon is a Team Plasma Pokémon, it is Knocked Out. (If the Defending Pokémon is not a Team Plasma Pokémon, this attack does nothing.)'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Dragonaxe
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let metalCount = 0;
      checkEnergy.energyMap.forEach(em => {
        metalCount += em.provides.filter(p => p === CardType.METAL || p === CardType.ANY).length;
      });

      effect.damage = 40 * metalCount;
    }

    // Attack 2: Strike of the Champion
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingCard = opponent.active.getPokemonCard();

      if (defendingCard && defendingCard.tags.includes(CardTag.TEAM_PLASMA)) {
        // KO the defending Pokemon by setting damage equal to remaining HP
        const checkHp = new CheckHpEffect(opponent, opponent.active);
        store.reduceEffect(state, checkHp);
        effect.damage = checkHp.hp;
      }
    }

    return state;
  }
}
