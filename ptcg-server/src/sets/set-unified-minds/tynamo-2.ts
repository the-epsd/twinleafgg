import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ATTACH_ENERGY_PROMPT } from '../../game/store/prefabs/prefabs';

export class Tynamo2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Generate Electricity',
      cost: [L],
      damage: 0,
      text: 'Search your deck for a [L] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tynamo';
  public fullName: string = 'Tynamo UNM 64';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Generate Electricity
    // Ref: set-unbroken-bonds/kyurem.ts (Call Forth Cold - search deck for energy and attach)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { min: 1, max: 1, allowCancel: true }
      );
    }

    return state;
  }
}
