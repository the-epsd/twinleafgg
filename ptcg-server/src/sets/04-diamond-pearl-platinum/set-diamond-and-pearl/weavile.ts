import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sneasel';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Nasty Plot',
    cost: [D],
    damage: 0,
    text: 'Search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Dark Pulse',
    cost: [D, D, D],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the total amount of Darkness Energy attached to all of your Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nasty Plot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this,
        {},
        { min: 1, max: 1, allowCancel: false }
      );
    }

    // Dark Pulse
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let darkEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach(em => {
          darkEnergy += em.provides.filter(t => t === CardType.DARK).length;
        });
      });
      effect.damage = 10 * darkEnergy;
    }

    return state;
  }
}
