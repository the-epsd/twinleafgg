import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Card, ChooseCardsPrompt, GameMessage, StateUtils } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Poliwrath extends PokemonCard {

  public name = 'Poliwrath';

  public set = 'BS';

  public fullName = 'Poliwrath BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.GRASS }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: 'Does 30 damage plus 10 more damage for each [W] Energy attached to Poliwrath but not used to pay for this attack\'s Energy cost. Extra [W] Energy after the 2nd doesn\'t count.'
    },
    {
      name: 'Whirlpool',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for Water energies
      const waterEnergies = checkEnergy.energyMap.filter(e => e.provides.includes(CardType.WATER));

      // Add damage for extra Water energies up to 2
      const extraEnergies = Math.min(waterEnergies.length - checkCost.cost.length, 2);
      effect.damage += extraEnergies * 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activeCardList = opponent.active;
      const activePokemonCard = activeCardList.getPokemonCard();

      let hasPokemonWithEnergy = false;

      if (activePokemonCard && activeCardList.cards.some(c => c.superType === SuperType.ENERGY)) {
        hasPokemonWithEnergy = true;
      }

      if (!hasPokemonWithEnergy) {
        return state;
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        cards = selected || [];
      });
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      return store.reduceEffect(state, discardEnergy);
    }

    return state;

  }

}