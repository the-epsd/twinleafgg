import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Grotle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Turtwig';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Synthesis',
    cost: [G],
    damage: 0,
    text: 'Search your deck for a Grass Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
  },
  {
    name: 'Cut',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Grotle';
  public fullName: string = 'Grotle DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Synthesis
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        effect.player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 1, allowCancel: true }
      );
    }

    return state;
  }
}
