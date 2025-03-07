import {ChooseCardsPrompt, GameMessage} from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS_TO_HAND, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MistysLapras extends PokemonCard {
  public tags = [ CardTag.MISTYS ];
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Swim Together',
      cost: [ W ],
      damage: 0,
      text: 'Search your deck for up to 3 Misty\'s Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Surf',
      cost: [ W, C ],
      damage: 60,
      text: ''
    },
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Misty\'s Lapras';
  public fullName: string = 'Misty\'s Lapras SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swim Together
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !card.tags.includes(CardTag.MISTYS)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 3, allowCancel: false, blocked }
      ), cards => {
        if (cards.length > 0) {
          MOVE_CARDS_TO_HAND(store, state, player, cards);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }

        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}