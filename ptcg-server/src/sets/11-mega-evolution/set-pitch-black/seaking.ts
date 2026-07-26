import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, State, SlotType, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Goldeen';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hydro Jet',
      cost: [C, C, C],
      damage: 0,
      text: "This attack does 30 damage to 1 of your opponent's Pokémon for each [W] Energy attached to this Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '14';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seaking';
  public fullName: string = 'Seaking M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-astral-radiance/beedrill-v.ts (Swarming Sting — DealDamageEffect vs bench PutDamageEffect)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);
      let waterUnits = 0;
      checkEnergy.energyMap.forEach((em) => {
        waterUnits += em.provides.filter(
          (t) =>
            t === CardType.WATER || t === CardType.ANY || t === CardType.WLFM || t === CardType.GRW,
        ).length;
      });
      const totalDamage = 30 * waterUnits;

      if (totalDamage <= 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const pick = targets[0];
          const dmg =
            pick === opponent.active
              ? new DealDamageEffect(effect, totalDamage)
              : new PutDamageEffect(effect, totalDamage);
          dmg.target = pick;
          store.reduceEffect(state, dmg);
        },
      );
    }

    return state;
  }
}
