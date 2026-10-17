import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [D];
  public weakness = [];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rummage',
    cost: [C],
    damage: 0,
    text: 'Look at the top 5 cards of your deck. Choose as many Trainer cards as you like, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Shadow Sneak',
    cost: [D, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If you and your opponent have a different number of Prize cards left, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Sableye';
  public fullName: string = 'Sableye SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rummage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      return LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(
        store,
        state,
        player,
        5,
        5,
        {
          filter: { superType: SuperType.TRAINER },
          revealChosenCards: true,
          sourceCard: this,
        },
      );
    }

    // Shadow Sneak
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.getPrizeLeft() !== opponent.getPrizeLeft()) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
