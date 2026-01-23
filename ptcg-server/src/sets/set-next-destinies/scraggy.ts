import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Scraggy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Shed Skin',
      cost: [C],
      damage: 0,
      text: 'Heal 40 damage from this Pokémon.'
    },
    {
      name: 'Lunge',
      cost: [D, D],
      damage: 40,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scraggy';
  public fullName: string = 'Scraggy NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shed Skin
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(40, effect, store, state);
    }

    // Lunge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
