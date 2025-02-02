import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';



export class StarmieV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 190;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [];

  public attacks = [
    {
      name: 'Swift',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Energy Spiral',
      cost: [CardType.WATER, CardType.WATER],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each Energy attached to all of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Starmie V';

  public fullName: string = 'Starmie V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Make damage ignore weakness
      effect.ignoreWeakness = true;
      // Make damage ignore resistance
      effect.ignoreResistance = true;

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damage = 50;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += energy.provides.length;
        });
      });

      effect.damage = energies * 50;
    }

    return state;
  }
}



