import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Geogate',
    cost: [P],
    damage: 0,
    text: 'Search your deck for up to 3 Basic [P] Pokémon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Bright Horns',
    cost: [P, P, C],
    damage: 120,
    text: 'This Pokémon can\'t use Bright Horns during your next turn.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Xerneas';
  public fullName: string = 'Xerneas M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC, cardType: CardType.PSYCHIC }, { min: 0, max: 3 });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Bright Horns')) {
        player.active.cannotUseAttacksNextTurnPending.push('Bright Horns');
      }
    }

    return state;
  }
}