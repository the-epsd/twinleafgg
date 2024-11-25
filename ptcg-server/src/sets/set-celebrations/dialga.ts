import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Dialga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'D';
  public cardType: CardType = CardType.METAL;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Temporal Backflow',
    cost: [CardType.METAL],
    damage: 0,
    text: 'Put a card from your discard pile into your hand.'
  },
  {
    name: 'Metal Blast',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'This attack does 20 more damage for each [M] Energy attached to this Pokemon.'
  }];

  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.discard.moveCardsTo(cards, player.hand);
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.METAL;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    return state;
  }
}