import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayerType } from '../../../game/store/actions/play-card-action';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Entei extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 140;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Flare Fall',
    cost: [R, R],
    damage: 30,
    damageCalculation: '+',
    text: 'If you have at least 4 Fire Energy in play, this attack does 90 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Entei';
  public fullName: string = 'Entei ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flare Fall
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let energyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.FIRE || cardType === CardType.ANY;
          }).length;
        });
      });
      if (energyCount >= 4)
        effect.damage += 60;
      return state;
    }

    return state;
  }
}
