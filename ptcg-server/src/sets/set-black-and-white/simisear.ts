import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Simisear extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pansear';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flame Burst',
      cost: [R],
      damage: 20,
      text: 'Does 20 damage to 2 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    },
    {
      name: 'Fury Swipes',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Simisear';
  public fullName: string = 'Simisear BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benchedTargets = opponent.bench.filter(b => b.cards.length > 0);
      if (benchedTargets.length === 0) {
        return state;
      }

      const maxTargets = Math.min(2, benchedTargets.length);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: maxTargets, max: maxTargets, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          targets.forEach(target => {
            const putDamage = new PutDamageEffect(effect, 20);
            putDamage.target = target;
            store.reduceEffect(state, putDamage);
          });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 40 * heads;
      });
    }

    return state;
  }
}
