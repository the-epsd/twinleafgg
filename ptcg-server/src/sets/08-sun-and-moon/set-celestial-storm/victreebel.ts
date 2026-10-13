import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, PowerType, StoreLike, State } from '../../../game';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  ADD_BURN_TO_PLAYER_ACTIVE,
  AFTER_ATTACK,
  COIN_FLIP_PROMPT,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Weepinbell';
  public hp: number = 140;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fragrance Trap',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Corrosive Acid',
    cost: [G, G, C],
    damage: 80,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Burned.'
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Victreebel';
  public fullName: string = 'Victreebel CES';

  public readonly FRAGRANCE_TRAP_MARKER = 'VICTREEBEL_FRAGRANCE_TRAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fragrance Trap
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.FRAGRANCE_TRAP_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            { allowCancel: false },
          );
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FRAGRANCE_TRAP_MARKER, this);

    // Corrosive Acid
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
