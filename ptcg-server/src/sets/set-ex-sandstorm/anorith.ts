import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Anorith extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Claw Fossil';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Fast Evolution',
    cost: [C],
    damage: 0,
    text: 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Pierce',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Anorith';
  public fullName: string = 'Anorith SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        // eslint-disable-next-line no-empty
        if (card instanceof PokemonCard && card.evolvesFrom !== '' && card.stage !== Stage.LV_X) {
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 1, max: 1, blocked });
    }

    return state;
  }
}