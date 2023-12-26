/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class DrapionV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Wild Style',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost C less for each of your opponent\'s Single Strike, Rapid Strike, and Fusion Strike Pokémon in play.'
  }];

  public attacks = [
    {
      name: 'Dynamic Tail',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 190,
      text: 'This attack also does 60 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name: string = 'Drapion V';

  public fullName: string = 'Drapion V LOR';

  // Implement ability
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
  
      const checkEnergy = new CheckProvidedEnergyEffect(effect.player);
      store.reduceEffect(state, checkEnergy);
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let wildStyleCount = 0;

      // Check opponent's active Pokemon
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.FUSION_STRIKE) ||
        opponentActive.tags.includes(CardTag.RAPID_STRIKE) ||
        opponentActive.tags.includes(CardTag.SINGLE_STRIKE))) {
        wildStyleCount += 1;
      }

      // Check opponent's benched Pokemon
      opponent.bench.forEach(cardList => {
        cardList.cards.forEach(card => {
          if (card instanceof PokemonCard &&
            (card.tags.includes(CardTag.FUSION_STRIKE) ||
              card.tags.includes(CardTag.RAPID_STRIKE) ||
              card.tags.includes(CardTag.SINGLE_STRIKE))) {
            wildStyleCount += 1;
          }
        });
      });

      // Reduce attack cost by removing 1 Colorless energy for each counted Pokemon
      const attackCost = this.attacks[0].cost;
      const colorlessToRemove = wildStyleCount;
      this.attacks[0].cost = attackCost.filter(c => c !== CardType.COLORLESS).slice(0, -colorlessToRemove);

    }
    return state;


  }
}