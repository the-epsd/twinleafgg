import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flare',
    cost: [R],
    damage: 20,
    text: ''
  },
{
    name: 'Flamethrower',
    cost: [R, R, C],
    damage: 50,
    text: 'Discard an Energy attached to Magmar.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flamethrower
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      return store.prompt(state, new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      checkProvidedEnergy.energyMap,
      [CardType.COLORLESS],
      { allowCancel: false }
      ), energy => {
      const cards: Card[] = (energy || []).map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
