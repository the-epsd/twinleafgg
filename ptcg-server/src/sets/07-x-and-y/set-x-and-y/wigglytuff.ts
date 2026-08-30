import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Jigglypuff';
  public cardType: CardType[] = [Y];
  public hp: number = 100;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gather Energy',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a basic Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
  },
  {
    name: 'Hocus Pinkus',
    cost: [Y, C, C],
    damage: 60,
    text: 'The Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'XY';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wigglytuff';
  public fullName: string = 'Wigglytuff XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gather Energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        effect.player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: true }
      );
    }

    // Hocus Pinkus
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
