import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard, ChooseCardsPrompt, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Phione extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Beckon',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Put a Supporter card from your discard pile into your hand.'
    },
    {
      name: 'Energy Press',
      cost: [CardType.WATER],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Energy attached to your opponent\'s Active Pokémon.'
    }
  ];

  public regulationMark: string = 'H';

  public set: string = 'TWM';

  public name: string = 'Phione';

  public fullName: string = 'Phione TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const itemCount = player.discard.cards.filter(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
      }).length;

      if (itemCount === 0) {
        return state;
      }

      const max = Math.min(1, itemCount);
      const min = max;

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { min, max, allowCancel: false }
        )], selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage = energyCount * 20;
    }

    return state;
  }

}
