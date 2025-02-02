import { StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WhiteKyurem extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Field Crush',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'If your opponent has a Stadium card in play, discard it.'
  }, {
    name: 'Freezing Flames',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has any [R] Energy attached to it, this attack does 80 more damage.'
  }];

  public set: string = 'LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'White Kyurem';

  public fullName: string = 'White Kyurem LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      
      if (!stadiumCard) {
        return state;
      }
      
      const stadiumCardList = StateUtils.findCardList(state, stadiumCard);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      
      if (stadiumCard !== undefined && owner !== effect.player) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
      }
      
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);
      
      const hasFireEnergy = checkProvidedEnergy.energyMap.some(e => e.provides.includes(CardType.ANY) || e.provides.includes(CardType.FIRE) || e.provides.includes(CardType.GRW) || e.provides.includes(CardType.GRPD));
      
      if (hasFireEnergy) {
        effect.damage += 80;
      }
      
      return state;
    }
    return state;
  }
}

