import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaStarmieex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 330;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Jet Blow',
    cost: [W],
    damage: 120,
    text: 'This attack also does 50 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  },
  {
    name: 'Nebula Beam',
    cost: [C, C, C],
    damage: 210,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any effects on your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Mega Starmie ex';
  public fullName: string = 'Mega Starmie ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do 50 damage to 1 benched Pokemon
      const benchedTargets = opponent.bench.filter(b => b.cards.length > 0);
      if (benchedTargets.length > 0) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          if (targets.length > 0) {
            const damageEffect = new PutDamageEffect(effect, 50);
            damageEffect.target = targets[0];
            store.reduceEffect(state, damageEffect);
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;

      effect.ignoreResistance = true;
      const applyWeakness = new ApplyWeaknessEffect(effect, 210);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }
}
