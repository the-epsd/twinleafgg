import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, MOVE_CARD_TO, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Floette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];
  public evolvesFrom = 'Flabébé';

  public powers = [{
    name: 'Flower Picking',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck.'
  }];

  public attacks = [{
    name: 'Magical Shot',
    cost: [Y, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CEC';
  public name: string = 'Floette';
  public fullName: string = 'Floette CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {

      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (wantToUse) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          if (opponent.hand.cards.length > 0) {
            const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
            const randomCard = opponent.hand.cards[randomIndex];
            MOVE_CARD_TO(state, randomCard, opponent.deck);
            SHUFFLE_DECK(store, state, opponent);
          }
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    return state;
  }
}