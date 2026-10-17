import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Feebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Splash',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Fast Evolution',
    cost: [W],
    damage: 0,
    text: 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Feebas';
  public fullName: string = 'Feebas GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fast Evolution
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || card.evolvesFrom === '' || card.stage === Stage.LV_X) {
          blocked.push(index);
        }
      });
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1, allowCancel: true, blocked });
    }

    return state;
  }
}
