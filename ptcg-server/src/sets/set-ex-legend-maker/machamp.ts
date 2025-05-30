import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Machoke';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Derail',
    cost: [F, C],
    damage: 40,
    text: 'Discard a Special Energy card, if any, attached to the Defending Pokémon.'
  },
  {
    name: 'Swift Blow',
    cost: [F, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Does 60 damage plus 20 damage for each React Energy card attached to Machamp.'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppActive = opponent.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, oppActive);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            oppActive,
            { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected;
          });
          oppActive.moveCardsTo(cards, opponent.discard);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      let energyCount = 0;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.card.name === 'React Energy') {
          energyCount++;
        }
      });

      effect.damage += 20 * energyCount;
    }

    return state;
  }
}
