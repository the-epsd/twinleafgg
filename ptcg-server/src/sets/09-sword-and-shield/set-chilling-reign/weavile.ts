import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Weavile extends PokemonCard {
  protected _tags = [CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sneasel';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Two-Hit KO',
    cost: [C],
    damage: 0,
    text: 'During your next turn, if the Defending Pokémon is damaged by an attack from a Rapid Strike Pokémon, it will be Knocked Out.',
  }, {
    name: 'Nasty Plot',
    cost: [W],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.',
  }];

  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN(store, state, effect, this, {
        filter: { sourceTags: [CardTag.RAPID_STRIKE] },
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2, allowCancel: false });
    }

    return state;
  }
}
