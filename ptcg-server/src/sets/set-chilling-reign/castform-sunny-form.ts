import { PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class CastformSunnyForm extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.FIRE;

  public hp = 70;

  public weakness = [{ type: CardType.WATER }];

  public resistance = [];

  public retreat = [];

  public powers = [
    {
      name: 'Weather Reading',
      text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
      powerType: PowerType.ABILITY,
      useWhenInPlay: false,
    }
  ];

  public attacks = [
    {
      name: 'High-Pressure Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 150,
      text: 'Discard a Stadium in play. If you can\'t, this attack does nothing.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public name: string = 'Castform Sunny Form';

  public fullName: string = 'Castform Sunny Form CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      console.log('Number of stadiums in discard pile: ' + player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length);

      if (player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length >= 8) {
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        this.attacks.forEach(attack => {
          attack.cost = [];
        });
        
        return state;
      } else {
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard !== undefined) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
      } else {
        effect.damage = 0;
      }

    }
    return state;
  }
}