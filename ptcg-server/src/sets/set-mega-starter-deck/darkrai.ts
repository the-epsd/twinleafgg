import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Darkrai extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Shadow Cloak',
      cost: [D],
      damage: 0,
      text: 'Search your deck for 2 Basic [D] Energy and attach them to this Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Dark Cutter',
      cost: [D, D, C],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'J';
  public set: string = 'MEZ';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai MEZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-vivid-voltage/pikachu-v.ts (Charge)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(
        store, state, effect.player, 2, 1,
        {
          destinationSlots: [SlotType.ACTIVE],
          energyFilter: { energyType: EnergyType.BASIC },
          validCardTypes: [CardType.DARK],
          min: 0,
          allowCancel: false,
          sameTarget: true
        }
      );
    }

    return state;
  }
}
