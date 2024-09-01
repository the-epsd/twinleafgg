import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Magnezoneex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.POKEMON_ex];

  public evolvesFrom = 'Magneton';

  public regulationMark = 'G';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 330;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Crush',
      cost: [CardType.LIGHTNING],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each Energy attached to all of your opponent\'s Pokémon.'
    },
    {
      name: 'Pulse Launcher',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 220,
      text: 'This Pokémon also does 30 damage to itself.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public name: string = 'Magnezone ex';

  public fullName: string = 'Magnezone ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

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



    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}
