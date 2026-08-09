import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, ATTACH_ENERGY_PROMPT } from '../../../game/store/prefabs/prefabs';
import { YOUR_POKEMON_CANNOT_ATTACK_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = F;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Ground Stream',
    cost: [F],
    damage: 20,
    text: 'Attach 2 [F] Energy cards from your discard pile to this Pokémon.'
  },
  {
    name: 'Gigaton Shake',
    cost: [F, C, C, C, C],
    damage: 220,
    text: 'During your next turn, your Pokémon can\'t attack. (This includes Pokémon that come into play on that turn.)'
  }];

  public set: string = 'UNM';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ground Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DISCARD,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { min: 0, max: 2, allowCancel: false }
      );
    }

    // Gigaton Shake
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return YOUR_POKEMON_CANNOT_ATTACK_DURING_YOUR_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
