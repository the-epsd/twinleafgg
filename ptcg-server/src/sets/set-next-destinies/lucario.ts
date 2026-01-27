import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, SlotType, GameMessage, GamePhase } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Riolu';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Reflexive Retaliation',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is your Active Pokemon and is damaged by an opponent\'s attack (even if this Pokemon is Knocked Out), put 2 damage counters on the Attacking Pokemon.'
  }];

  public attacks = [{
    name: 'Aura Sphere',
    cost: [F, F],
    damage: 50,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public set: string = 'NXD';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reflexive Retaliation - damage attacker when hit
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Only works if this is the active Pokemon and was damaged by opponent
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      // Only during attack phase
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Put 2 damage counters on attacker
      effect.source.damage += 20;
    }

    // Aura Sphere - damage a benched Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
