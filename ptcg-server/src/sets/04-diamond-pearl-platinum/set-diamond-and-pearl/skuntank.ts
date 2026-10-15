import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Skuntank extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Stunky';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Frustration',
    cost: [D, D],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon that doesn\'t have any damage counters on it. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Toxic Cloud',
    cost: [D, D, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Skuntank';
  public fullName: string = 'Skuntank DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frustration
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasUndamagedActive = opponent.active.cards.length > 0 && opponent.active.damage === 0;
      const hasUndamagedBench = opponent.bench.some(b => b.cards.length > 0 && b.damage === 0);
      if (!hasUndamagedActive && !hasUndamagedBench) {
        return state;
      }

      const blocked: CardTarget[] = [];
      if (opponent.active.damage > 0) {
        blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }
      opponent.bench.forEach((b, index) => {
        if (b.cards.length === 0 || b.damage > 0) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const target = selected[0];
        if (target === opponent.active) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        } else {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Toxic Cloud
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 20);
        }
      });
    }

    return state;
  }
}
