import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class NsVanillite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.NS];
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Pokemon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Icy Snow',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'N\'s Vanillite';
  public fullName: string = 'N\'s Vanillite M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 2 }
      );
    }
    return state;
  }
}


