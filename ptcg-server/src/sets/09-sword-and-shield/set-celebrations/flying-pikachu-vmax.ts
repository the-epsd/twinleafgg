import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class FlyingPikachuVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Flying Pikachu V';
  protected _tags = [CardTag.POKEMON_VMAX];
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 310;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Max Balloon',
    cost: [L, C, C],
    damage: 160,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  }];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Flying Pikachu VMAX';
  public fullName: string = 'Flying Pikachu VMAX CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Max Balloon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    return state;
  }
}
