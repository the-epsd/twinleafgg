import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseEnergyPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ducklett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Firefighting',
    cost: [C],
    damage: 0,
    text: 'Discard a [R] Energy from your opponent\'s Active Pokémon.'
  },
  {
    name: 'Wing Attack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public name: string = 'Ducklett';
  public fullName: string = 'Ducklett SV11W';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const energyList: CardType[] = [];
      for (let i = 0; i < 1; i++) {
        energyList.push(CardType.FIRE);
      }

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        energyList,
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = opponent.active;
        return store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}