import {
  Attack,
  Card,
  Resistance,
  State,
  StoreLike,
  Weakness
} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mareep extends PokemonCard {

  public set = 'TEU';

  public setNumber = '41';

  public cardImage: string = 'assets/cardback.png';

  public fullName = 'Mareep TEU';

  public name = 'Mareep';

  public cardType: CardType = CardType.LIGHTNING;

  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public weakness: Weakness[] = [{ type: CardType.FIGHTING }];

  public resistance: Resistance[] = [{ type: CardType.METAL, value: -20 }];

  public retreat: CardType[] = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Shock Bolt',
      cost: [CardType.LIGHTNING],
      damage: 30,
      text: 'Discard all [L] Energy from this Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = [];
      for (const energyMap of checkProvidedEnergy.energyMap) {
        const energy = energyMap.provides.filter(t => t === CardType.LIGHTNING || t === CardType.ANY || t === CardType.WLFM || t === CardType.LPM);
        if (energy.length > 0) {
          cards.push(energyMap.card);
        }
      }

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    return state;
  }
}
