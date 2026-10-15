import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Treecko';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Greenness',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 Grass Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Poison Breath',
    cost: [G, G],
    damage: 30,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Grovyle';
  public fullName: string = 'Grovyle GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Greenness
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 2, allowCancel: true }
      );
    }

    // Poison Breath
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
