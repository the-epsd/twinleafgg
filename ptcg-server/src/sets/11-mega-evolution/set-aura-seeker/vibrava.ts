import { CardType, GameError, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  MOVE_CARDS,
  REMOVE_MARKER_AT_END_OF_TURN,
  SHOW_CARDS_TO_PLAYER,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public hp: number = 90;
  public cardType: CardType[] = [N];
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Vibrating Wings',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'If this card is in your hand, you may use this Ability once during your turn. If you do, discard this card. Look at the top card of your deck, then return it.'
  }];

  public attacks = [{
    name: 'Sand Spray',
    cost: [G, F],
    damage: 60,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava FLO';

  public readonly VIBRATING_WINGS_MARKER = 'VIBRAVA_FLO_VIBRATING_WINGS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vibrating Wings
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!player.hand.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.VIBRATING_WINGS_MARKER, this);
      ABILITY_USED(player, this);

      MOVE_CARDS(store, state, player.hand, player.discard, { cards: [this], sourceCard: this });

      if (player.deck.cards.length > 0) {
        SHOW_CARDS_TO_PLAYER(store, state, player, [player.deck.cards[0]]);
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.VIBRATING_WINGS_MARKER, this);

    return state;
  }
}
