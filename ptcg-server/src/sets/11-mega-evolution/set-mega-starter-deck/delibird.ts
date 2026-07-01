import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Delibird extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Present',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may look at the top 6 cards of your deck, choose an Energy you find there, reveal it, and put it into your hand. Shuffle the remaining cards and put them on the bottom of your deck.'
  }];

  public attacks = [{
    name: 'Beat',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'MEE';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Delibird';
  public fullName: string = 'Delibird MEE';

  public readonly ENERGY_PRESENT_MARKER = 'DELIBIRD_MEE_ENERGY_PRESENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-shining-fates/celebi.ts (Woodland Stroll), set-temporal-forces/metang.ts (remainder to bottom)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ENERGY_PRESENT_MARKER, this);
      ABILITY_USED(player, this);

      LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(
        store, state, player, 6, 1,
        {
          filter: { superType: SuperType.ENERGY },
          revealChosenCards: true,
          remainderDestination: 'bottom',
          sourceCard: this
        }
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENERGY_PRESENT_MARKER, this);

    return state;
  }
}
