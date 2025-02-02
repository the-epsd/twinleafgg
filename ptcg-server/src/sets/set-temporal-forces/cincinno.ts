import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Cinccino extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Minccino';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Gentle Slap',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Special Roll',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      damageCalculation: 'x',
      text: 'This attack does 70 damage for each Special Energy card attached to this Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '137';

  public name: string = 'Cinccino';

  public fullName: string = 'Cinccino TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const pokemon = player.active;

      let specialEnergyCount = 0;

      pokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          if (c.energyType === EnergyType.SPECIAL) {
            specialEnergyCount++;
          }
        }
      });

      effect.damage = specialEnergyCount * 70;

      return state;
    }
    return state;
  }
}   