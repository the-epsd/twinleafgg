import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PowerType, StoreLike, State, StateUtils } from '../../../game';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  IS_ABILITY_BLOCKED,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
} from '../../../game/store/prefabs/prefabs';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vigoroth';
  public cardType: CardType[] = [C];
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Counterattack',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Dynamic Swing',
    cost: [C, C, C, C],
    damage: 100,
    damageCalculation: '+',
    text: 'You may do 100 more damage. If you do, during your opponent\'s next turn, this Pokémon takes 100 more damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'UNM';
  public setNumber: string = '170';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattack
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      if (targetPlayer.active.getPokemonCard() !== this) {
        return state;
      }

      const damageEffect = new PutCountersEffect(effect, 40);
      damageEffect.target = effect.source;
      store.reduceEffect(state, damageEffect);
    }

    // Dynamic Swing — optional self vulnerability via negative damageReductionNextTurn
    // Ref: set-crimson-invasion/kommo-o.ts (Clanging Scales)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const attackEffect = effect;

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_DEAL_MORE_DAMAGE,
      ), wantToBoost => {
        if (wantToBoost) {
          attackEffect.damage += 100;
          player.active.damageReductionNextTurn = -100;
        }
      });
    }

    return state;
  }
}
