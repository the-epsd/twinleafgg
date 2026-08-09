import { State, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class ArceusMetal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ARCEUS];
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Metal Barrier',
    cost: [M, C, C],
    damage: 40,
    text: "Prevent all effects of attacks, including damage, done to Arceus by Pokémon LV.X during your opponent's next turn.",
  }];

  public set: string = 'AR';
  public setNumber: string = 'AR9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Metal AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Barrier
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceTags: [CardTag.POKEMON_LV_X] });
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
    }

    return state;
  }
}
