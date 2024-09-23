import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { HealTargetEffect, PutCountersEffect, RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class Tsareenaex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage = Stage.STAGE_2;

  public evolvesFrom = 'Steenee';

  public cardType = CardType.WATER;

  public hp = 310;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Icicle Sole',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Put damage counters on 1 of your opponent\'s Pokémon until its remaining HP is 30.'
    },
    {
      name: 'Trop Kick',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 180,
      text: 'Heal 30 damage from this Pokémon and it recovers from all Special Conditions.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Tsareena ex';

  public fullName: string = 'Tsareena ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const selectedTarget = targets[0];
        const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
        store.reduceEffect(state, checkHpEffect);

        const totalHp = checkHpEffect.hp;
        let damageAmount = totalHp - 30;

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
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
    }
    return state;
  }

}


