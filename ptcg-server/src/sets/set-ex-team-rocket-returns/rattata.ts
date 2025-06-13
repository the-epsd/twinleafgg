import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Snarl',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, this attack does 10 damage to the Defending Pokémon. If tails, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Rattata';
  public fullName: string = 'Rattata TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage = 10;
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}