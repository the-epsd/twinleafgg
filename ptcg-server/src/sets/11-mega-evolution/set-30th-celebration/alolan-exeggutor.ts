import { CardType, PokemonCard, PokemonCardList, PowerType, Stage, State, StateUtils, StoreLike } from "../../../game";
import { CheckHpEffect, CheckProvidedEnergyEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from "../../../game/store/prefabs/prefabs";

export class AlolanExeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Exeggcute';
  public hp: number = 150;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Scale Up',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has 6 or more [G] Energy attached, it gets +250 HP.'
  }];

  public attacks = [{
    name: 'Mega Drain',
    cost: [G, C, C, C],
    damage: 150,
    text: 'Heal 50 damage from this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Alolan Exeggutor';
  public fullName: string = 'Alolan Exeggutor 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scale Up
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, effect.target as PokemonCardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let grassEnergy = 0;
      checkProvidedEnergy.energyMap.forEach(em => {
        grassEnergy += em.provides.filter(t => t === CardType.GRASS || t === CardType.ANY).length;
      });

      if (grassEnergy >= 6) {
        effect.hp += 250;
      }
    }

    // Mega Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 50);
    }

    return state;
  }
}
