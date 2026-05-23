import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Necrozma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 130;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Barrier Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'During your opponent\'s turn, this Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }, {
    name: 'Special Laser',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
    damage: 100,
    text: 'If this Pokemon has Special Energy attached to it, this attack does 60 more damage.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Necrozma';
  public fullName: string = 'Necrozma UNM';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    

    

    if (effect instanceof AttackEffect && effect.attack == this.attacks[1]) {
      const player = effect.player;
      const pokemon = player.active;

      let specialEnergyCount = 0;
      pokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          if (c.energyType === EnergyType.SPECIAL) {
            specialEnergyCount++;
          }
        }
      });

      if (specialEnergyCount > 0) {
        effect.damage += 60;
      }
    }
    return state;
  }
}
