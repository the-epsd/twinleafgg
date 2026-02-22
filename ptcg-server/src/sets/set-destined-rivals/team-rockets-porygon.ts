import { State, StoreLike } from '../../game';
import { CardType, Stage, CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage } from '../../game/game-message';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsPorygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hacking',
      cost: [C],
      damage: 0,
      text: 'Discard 1 card from your hand. Then your opponent discards 1 card from their hand.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '153';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Porygon';
  public fullName: string = 'Team Rocket\'s Porygon DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Player chooses 1 card to discard
      if (player.hand.cards.length > 0) {
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { allowCancel: false, min: 1, max: 1 }
        ), cards => {
          cards = cards || [];

          // Discard the selected card
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });

          // Then opponent chooses 1 card to discard
          if (opponent.hand.cards.length > 0) {
            return store.prompt(state, new ChooseCardsPrompt(
              opponent,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              opponent.hand,
              {},
              { allowCancel: false, min: 1, max: 1 }
            ), oppCards => {
              oppCards = oppCards || [];

              // Discard the opponent's selected card
              MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: oppCards, sourceCard: this, sourceEffect: this.attacks[0] });

              return state;
            });
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}
