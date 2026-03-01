import { Card, ChooseEnergyPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PokeParksLatias extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psywave',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'This attack does 10 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Mist Ball',
    cost: [R, W, C],
    damage: 50,
    text: 'Discard a [R] Energy and a [W] Energy attached to this Pokémon.'
  }];

  public set: string = 'PPF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'PokéPark\'s Latias';
  public fullName: string = 'PokéPark\'s Latias PPF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);

      const energyCount = checkEnergy.energyMap.length;
      effect.damage = 10 * energyCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE, CardType.WATER],
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