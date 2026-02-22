import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RaichuAlolanRaichuGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 260;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Tandem Shock',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 80,
    text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn,'
      + ' this attack does 80 more damage, and your opponent\'s Active Pokémon is now Paralyzed.'
  },
  {
    name: 'Lightning Ride-GX',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 150,
    text: ' Switch this Pokémon with 1 of your Benched Pokémon. If this Pokémon has at least 2 extra [L] Energy attached to it (in addition to this attack\'s cost), this attack does 100 more damage.'
      + '  (You can\'t use more than 1 GX attack in a game.) '
  }];

  public set = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name = 'Raichu & Alolan Raichu-GX';
  public fullName = 'Raichu & Alolan Raichu GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (this.movedToActiveThisTurn) {
        effect.damage += 80;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let LightningEnergyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        LightningEnergyCount += em.provides.filter(cardType => {
          return cardType === CardType.LIGHTNING;
        }).length;
      });

      if (LightningEnergyCount - 2 >= 2 && checkProvidedEnergyEffect.energyMap.length >= 5) {
        effect.damage += 100;
      }

      return state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);
      });

    }

    return state;
  }
}