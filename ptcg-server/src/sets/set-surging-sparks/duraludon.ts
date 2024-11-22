import { PokemonCard, Stage, CardType, StoreLike, State, Card, ChooseEnergyPrompt, GameMessage } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Duraludon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Confront',
      cost: [CardType.METAL, CardType.METAL],
      damage: 50,
      text: ''
    },
    {
      name: 'Durant Beam',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL],
      damage: 130,
      text: 'Discard 2 Energy from this Pokemon.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Duraludon';
  public fullName: string = 'Duraludon SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
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
