import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Growl',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon ' +
        'is reduced by 20 (before applying Weakness and Resistance).',
    },
    {
      name: 'Quick Attack',
      cost: [C, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.',
    },
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}