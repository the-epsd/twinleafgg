import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { TAKE_MORE_PRIZES_IF_DEFENDING_KNOCKED_OUT_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Marshadow extends PokemonCard {
  protected _tags = [CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Rapid Hunt',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 Rapid Strike cards, reveal them, and put them into your hand. Then, shuffle your deck.',
    },
    {
      name: 'Shadow Flicker',
      cost: [C],
      damage: 10,
      text: 'If the Defending Pokémon is Knocked Out during your next turn, take 1 more Prize card.',
    },
  ];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marshadow';
  public fullName: string = 'Marshadow EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index: number) => {
        if (!card.hasTag(CardTag.RAPID_STRIKE)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 0, max: 2, allowCancel: true, blocked },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return TAKE_MORE_PRIZES_IF_DEFENDING_KNOCKED_OUT_DURING_YOUR_NEXT_TURN(store, state, effect, this, 1);
    }

    return state;
  }
}
