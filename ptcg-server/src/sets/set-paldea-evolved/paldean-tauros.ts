import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';


export class PaldeanTauros extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Raging Horns',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Blaze Dash',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 120,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public regulationMark: string = 'G';
  
  public set: string = 'PAL';

  public name: string = 'Paldean Tauros';

  public fullName: string = 'Paldean Tauros PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
    }

    return state;
  }

}
