import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../../game/store/card/card-types';
import { StoreLike, State, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Zamazenta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Metal Armament',
      cost: [C],
      damage: 30,
      text: 'Attach a basic Energy card from your discard pile to this Pokémon.'
    },
    {
      name: 'Amazing Shield',
      cost: [L, F, M],
      damage: 180,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon VMAX.'
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zamazenta';
  public fullName: string = 'Zamazenta VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Armament
    // Ref: set-burning-shadows/turtonator.ts
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store, state, player, 1, undefined,
        {
          destinationSlots: [SlotType.ACTIVE],
          energyFilter: { energyType: EnergyType.BASIC },
          min: 0
        }
      );
    }

    // Amazing Shield
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceTags: [CardTag.POKEMON_VMAX] });
    }

    return state;
  }
}
