import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, Card, ChooseCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class ScreamTailex extends PokemonCard {
  protected _tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 190;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scream',
    cost: [C],
    damage: 0,
    text: 'You can use this attack only if you go second, and only during your first turn. During your opponent\'s next turn, they can\'t play any Supporter cards from their hand.'
  },
  {
    name: 'Crunch',
    cost: [P, C, C],
    damage: 120,
    text: 'Discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Scream Tail ex';
  public fullName: string = 'Scream Tail ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (state.turn !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      return OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
    }

    // Crunch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }
      let card: Card;
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          card = selected[0];
          return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
        },
      );
    }
    return state;
  }
}
