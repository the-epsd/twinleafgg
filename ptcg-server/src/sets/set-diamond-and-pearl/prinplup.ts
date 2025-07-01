import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';

export class Prinplup extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Piplup';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Aqua Shower',
    cost: [W],
    damage: 0,
    text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Brine',
    cost: [W, W],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon that has any damage counters on it. This attack does 40 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Prinplup';
  public fullName: string = 'Prinplup DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      effect.damage = 10;

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Gather all opponent's Pokemon (active + benched) that have any damage counters
      const damagedTargets: CardTarget[] = [];

      // Check opponent's active
      if (opponent.active.cards.length > 0 && opponent.active.damage > 0) {
        damagedTargets.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }

      // Check opponent's bench
      opponent.bench.forEach((b, index) => {
        if (b.cards.length > 0 && b.damage > 0) {
          damagedTargets.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      if (damagedTargets.length === 0) {
        return state;
      }

      // Block all Pokemon (active and benched) that have no damage
      const blocked: CardTarget[] = [];
      if (opponent.active.damage === 0) {
        blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }
      opponent.bench.forEach((b, index) => {
        if (b.cards.length > 0 && b.damage === 0) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), target => {
        if (!target || target.length === 0) {
          return;
        }
        const damageEffect = new DealDamageEffect(effect, 40);
        damageEffect.target = target[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}