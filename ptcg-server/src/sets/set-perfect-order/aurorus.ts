import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GamePhase, StateUtils, PlayerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PreventAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Aurorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Amaura';
  public cardType: CardType = W;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Tundra Wall',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'While this Pokemon is in play, all of your Pokemon that have a [W] Energy attached take 50 less damage from attacks from your opponent\'s Pokemon. This Ability does not stack.'
  }];

  public attacks = [{
    name: 'Freezing Chill',
    cost: [W, W, C],
    damage: 150,
    text: 'During your opponent\'s next turn, the Defending Pokemon can\'t attack.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Aurorus';
  public fullName: string = 'Aurorus M3';

  public readonly TUNDRA_WALL_MARKER = 'TUNDRA_WALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Reduce damage by 50 for Pokemon with [W] Energy
    if (effect instanceof PutDamageEffect) {
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      const opponent = StateUtils.getOpponent(state, targetOwner);

      // Only reduce damage from opponent's attacks
      if (sourceOwner !== opponent) {
        return state;
      }

      // Check if Aurorus is in play
      let isAurorusInPlay = false;
      targetOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isAurorusInPlay = true;
        }
      });

      if (!isAurorusInPlay) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }

      // Check if target has [W] Energy (only reduce for Pokemon with [W] Energy)
      const checkEnergy = new CheckProvidedEnergyEffect(targetOwner, effect.target);
      store.reduceEffect(state, checkEnergy);

      const hasWaterEnergy = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)
      );

      if (hasWaterEnergy) {
        effect.damage = Math.max(0, effect.damage - 50);
      }
    }

    // Attack: Prevent opponent from attacking next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const preventAttackEffect = new PreventAttackEffect(effect);
      store.reduceEffect(state, preventAttackEffect);
    }

    return state;
  }
}
