import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { SlotType } from '../../../game/store/actions/play-card-action';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 130;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Geomancy',
    cost: [Y],
    damage: 0,
    text: 'Choose 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a [Y] Energy card and attach it to that Pokémon. Shuffle your deck afterward.'
  },
  {
    name: 'Rainbow Spear',
    cost: [Y, Y, C],
    damage: 100,
    text: 'Discard an Energy attached to this Pokémon.'
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Xerneas';
  public fullName: string = 'Xerneas STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Geomancy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, state, player, 2, 2,
        {
          destinationSlots: [SlotType.BENCH],
          energyFilter: { energyType: EnergyType.BASIC },
          min: 2,
          allowCancel: false,
          differentTargets: true,
          validCardTypes: [CardType.FAIRY],
        }
      );
    }

    // Rainbow Spear
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
