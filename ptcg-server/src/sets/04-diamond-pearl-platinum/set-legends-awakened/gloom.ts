import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Oddish';
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Powder',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Frustration',
    cost: [G, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon that doesn\'t have any damage counters on it. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Gloom';
  public fullName: string = 'Gloom LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sleep Powder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Frustration
    if (WAS_ATTACK_USED(effect, 1, this)) {
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

    return state;
  }
}
