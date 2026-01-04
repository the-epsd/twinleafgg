import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { SuperType } from '../../../game';

export class MegaMeganiumex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Bayleef';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 360;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Giant Bouquet',
    cost: [C, C, C],
    damage: 70,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each [G] Energy attached to this Pokemon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'MC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Mega Meganium ex';
  public fullName: string = 'Mega Meganium ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let grassEnergyCount = 0;

      player.active.energies.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY) {
          // Check if it's a Grass energy
          const energyCard = card as any;
          if (energyCard.energyType === 'G' || energyCard.provides?.includes('G') || energyCard.provides?.includes(CardType.ANY)) {
            grassEnergyCount++;
          }
        }
      });

      effect.damage = 70 + (50 * grassEnergyCount);
    }
    return state;
  }
}