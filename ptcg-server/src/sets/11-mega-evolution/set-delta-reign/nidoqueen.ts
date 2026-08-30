import { CardType, GameError, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, COIN_FLIP_PROMPT, GUST_OPPONENT_BENCHED_POKEMON, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public cardType: CardType[] = [D];
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Motherly Summon',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon.'
  }];

  public attacks = [{
    name: 'Giga Impact',
    cost: [D, C, C],
    damage: 150,
    text: 'This Pokemon can\'t attack during your next turn.'
  }];

  public regulationMark: string = 'J';

  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen M6';

  public readonly MOTHERLY_SUMMON_MARKER = 'NIDOQUEEN_MOTHERLY_SUMMON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Motherly Summon
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.MOTHERLY_SUMMON_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON(store, state, player);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MOTHERLY_SUMMON_MARKER, this);

    // Giga Impact
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
