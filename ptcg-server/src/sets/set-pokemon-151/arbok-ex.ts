import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Arbokex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ekans';
  public cardType: CardType = D;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bind Down',
    cost: [D, D],
    damage: 70,
    text: ' During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
  },
  {
    name: 'Menacing Fangs',
    cost: [D, D, D],
    damage: 150,
    text: ' Your opponent discards 2 cards from their hand. '
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Arbok ex';
  public fullName: string = 'Arbok ex MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length <= 2) {
        const cards = opponent.hand.cards;
        opponent.hand.moveCardsTo(cards, player.discard);
        return state;
      }

      store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
      return state;
    }
    return state;
  }
}