import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, State, SlotType, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { VoltaicLightningEnergy } from './voltaic-lightning-energy';

export class Vikavolt extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charjabug';
  public cardType: CardType = L;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Quick Dive',
      cost: [L],
      damage: 0,
      text: "This attack does 50 damage to 1 of your opponent's Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
    },
    {
      name: 'Giga Railgun',
      cost: [L, L],
      damage: 260,
      text: 'If this Pokémon has no Voltaic [L] Energy attached, this attack does nothing.',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '26';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vikavolt';
  public fullName: string = 'Vikavolt M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ),
        (picked) => {
          if (!picked || picked.length === 0) {
            return;
          }
          const t = picked[0];
          const dmg =
            t === opponent.active
              ? new DealDamageEffect(effect, 50)
              : new PutDamageEffect(effect, 50);
          dmg.target = t;
          store.reduceEffect(state, dmg);
        },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const hasVoltaic = effect.player.active.cards.some(
        (c) => c instanceof VoltaicLightningEnergy || c.name === 'Voltaic [L] Energy',
      );
      if (!hasVoltaic) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
