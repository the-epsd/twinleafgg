import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Drawup Power',
    cost: [],
    damage: 0,
    text: 'Search your deck for an Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Extend Ears',
    cost: [C],
    damage: 10,
    text: 'Remove 1 damage counter from each of your Benched Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Buneary';
  public fullName: string = 'Buneary MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList !== effect.player.active) {
          const healEffect = new HealEffect(effect.player, cardList, 1);
          state = store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
