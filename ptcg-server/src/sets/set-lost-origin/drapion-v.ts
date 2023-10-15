/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

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

  public set2: string = 'lostorigin';

  public setNumber: string = '118';

  public name: string = 'Drapion V';

  public fullName: string = 'Drapion V LOR';

  // Implement ability
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
  
      if (effect instanceof CheckAttackCostEffect) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        const index = effect.cost.indexOf(CardType.COLORLESS);

        let wildStyleCount = 0;

        if (opponent.active?.getPokemonCard()?.tags.includes(CardTag.FUSION_STRIKE || CardTag.RAPID_STRIKE || CardTag.SINGLE_STRIKE)) {
          wildStyleCount++;
        }

        opponent.bench.forEach(benchSpot => {
          if (benchSpot.getPokemonCard()?.tags.includes(CardTag.FUSION_STRIKE || CardTag.RAPID_STRIKE || CardTag.SINGLE_STRIKE)) {
            wildStyleCount++;
          }

          const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
          store.reduceEffect(state, checkPokemonTypeEffect);

          if (wildStyleCount > 0 && checkPokemonTypeEffect.cardTypes.includes(CardType.DARK) && index > 0) {
            effect.cost.splice(index, 1);
          }

        });


      }
    }

    return state;
  }

}
