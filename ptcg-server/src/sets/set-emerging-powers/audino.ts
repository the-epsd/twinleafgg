import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Audino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Powerful Slap',
      cost: [C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 40 damage times the number of heads.'
    },
    {
      name: 'Heal Pulse',
      cost: [C, C, C],
      damage: 0,
      text: 'Heal 50 damage from 1 of your Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Audino';
  public fullName: string = 'Audino EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let energyCount = 0;
      checkEnergy.energyMap.forEach(em => {
        energyCount += em.provides.length;
      });

      if (energyCount === 0) {
        (effect as AttackEffect).damage = 0;
        return state;
      }

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 40 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          const target = targets[0];
          target.damage = Math.max(0, target.damage - 50);
        }
      });
    }

    return state;
  }
}
