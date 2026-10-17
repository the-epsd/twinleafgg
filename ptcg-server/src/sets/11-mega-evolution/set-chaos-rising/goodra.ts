import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { RetreatEffect } from '../../../game/store/effects/game-effects';
import { PokemonCard, StateUtils, StoreLike, State } from '../../../game';
import { GameError, GameMessage } from '../../../game';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ADD_MARKER,
  COIN_FLIP_PROMPT,
  DISCARD_TOP_X_CARDS_FROM_YOUR_DECK,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

const GOODRA_SLIMY_SLIP_ALLOWED = 'GOODRA_SLIMY_SLIP_ALLOWED';

export class Goodra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Sliggoo';
  public hp: number = 160;
  public cardType: CardType[] = [N];
  public weakness: { type: CardType }[] = [];
  public resistance: { type: CardType; value: number }[] = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Slimy Sliding',
    powerType: PowerType.ABILITY,
    text: "When your opponent's Active Pokémon retreats, your opponent flips a coin. If tails, Energy for its Retreat Cost is not discarded, and they don't switch Pokémon. The effect of Slimy Sliding doesn't stack.",
  }];

  public attacks = [{
    name: 'Dragon Pulse',
    cost: [W, P],
    damage: 160,
    text: 'Discard the top card of your deck.',
  }];

  public regulationMark = 'J';

  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Goodra';
  public fullName: string = 'Goodra M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slimy Sliding
    if (effect instanceof RetreatEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      if (retreatingPlayer.marker.hasMarker(GOODRA_SLIMY_SLIP_ALLOWED)) {
        REMOVE_MARKER(GOODRA_SLIMY_SLIP_ALLOWED, retreatingPlayer);
        return state;
      }

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
      )) {
        return state;
      }

      effect.preventDefault = true;
      return COIN_FLIP_PROMPT(store, state, retreatingPlayer, (result) => {
        if (!result) {
          throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
        }
        ADD_MARKER(GOODRA_SLIMY_SLIP_ALLOWED, retreatingPlayer, this);
        effect.preventDefault = false;
        store.reduceEffect(state, effect);
      });
    }

    // Dragon Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 1, this, effect);
    }

    return state;
  }
}
