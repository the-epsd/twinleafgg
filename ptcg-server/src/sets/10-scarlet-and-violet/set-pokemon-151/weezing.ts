import { CardType, GamePhase, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Koffing';
  public cardType: CardType[] = [D];
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Let\'s Have a Blast',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your ' +
    'opponent\'s Pokémon, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Spinning Fumes',
    cost: [C, C],
    damage: 50,
    text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. ' +
    '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Let's Have a Blast — Ref: set-30th-celebration/gengar-ex.ts
    if (
      effect instanceof KnockOutEffect &&
      effect.target.cards.includes(this) &&
      effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)
    ) {
      const abilityOwner = effect.player;
      const attackerOwner = StateUtils.getOpponent(state, abilityOwner);

      // Do not activate between turns, or when it's not opponents turn, or if not Active
      if (state.phase !== GamePhase.ATTACK ||
        abilityOwner.active.getPokemonCard() !== this ||
        state.players[state.activePlayer] !== attackerOwner
      ) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, abilityOwner, flipResult => {
        if (!flipResult) {
          return;
        }
        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          abilityOwner,
          this.powers[0],
          this,
          attackerOwner.active,
        )) {
          return;
        }
        attackerOwner.active.damage += 999;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}
