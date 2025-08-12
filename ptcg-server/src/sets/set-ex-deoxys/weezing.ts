import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { ADD_MARKER, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, HAS_MARKER, REMOVE_MARKER, SIMULATE_COIN_FLIP, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Liability',
    cost: [C],
    damage: 0,
    text: 'Put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out. Weezing does 70 damage to itself.'
  },
  {
    name: 'Smogscreen',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing DX';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      const totalHp = checkHpEffect.hp;
      let damageAmount = totalHp - 10;

      // Adjust damage if the target already has damage
      const targetDamage = selectedTarget.damage;
      if (targetDamage > 0) {
        damageAmount = Math.max(0, damageAmount - targetDamage);
      }

      if (damageAmount > 0) {
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      } else if (damageAmount <= 0) {
        const damageEffect = new PutCountersEffect(effect, 0);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      }

      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
    }

    if (effect instanceof AttackEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

      if (!coinFlipResult) {
        //effect.damage = 0;
        effect.preventDefault = true;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
        REMOVE_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this);
      }
    }

    return state;
  }
}