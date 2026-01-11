import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Regirock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Regi Gate',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Giga Impact',
    cost: [F, F, C],
    damage: 140,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Regirock';
  public fullName: string = 'Regirock ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: false });
    }

    // Giga Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}