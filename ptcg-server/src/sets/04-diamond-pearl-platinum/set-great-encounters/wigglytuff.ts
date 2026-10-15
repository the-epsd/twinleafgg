import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Jigglypuff';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Good Night Melody',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may use this power. Each Active Pokémon (both yours and your opponent\'s) is now Asleep. This power can\'t be used if Wigglytuff is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Ballon Attack',
    cost: [C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If Igglybuff is anywhere under Wigglytuff, this attack does 40 damage plus 20 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Wigglytuff';
  public fullName: string = 'Wigglytuff GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Good Night Melody
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      const opponent = StateUtils.getOpponent(state, player);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
      opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
      return state;
    }

    // Ballon Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const hasIgglybuff = effect.player.active.cards.some(
        c => c instanceof PokemonCard && c.name === 'Igglybuff'
      );
      if (hasIgglybuff) {
        effect.damage += 20;
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
