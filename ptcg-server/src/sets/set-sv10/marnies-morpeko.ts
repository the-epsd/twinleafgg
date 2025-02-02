import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from "../../game";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";

export class MarniesMorpeko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Spike Wheel',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 40 more damage for each [D] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'SVOM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Marnie\'s Morpeko';
  public fullName: string = 'Marnie\'s Morpeko SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.DARK || cardType === CardType.ANY
        ).length;
      });

      effect.damage += energyCount * 40;
    }
    return state;
  }
}