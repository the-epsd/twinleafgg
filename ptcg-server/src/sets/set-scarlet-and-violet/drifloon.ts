import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Drifloon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Gust',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Balloon Blast',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '89';

  public name: string = 'Drifloon';

  public fullName: string = 'Drifloon SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Get Dodrio's damage
      const drifloonDamage = effect.player.active.damage;

      // Calculate 30 damage per counter
      const damagePerCounter = 30;
      effect.damage = (drifloonDamage * damagePerCounter / 10);

      return state;
    }

    return state;
  }
}