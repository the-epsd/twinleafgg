import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Flittle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 50;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Psychic',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }]

  public set: string = 'PAR';
  public regulationMark: string = 'G';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flittle';
  public fullName: string = 'Flittle PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active;

      let energyCount = 0;

      opponentActivePokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          energyCount++;
        }
      });

      effect.damage += energyCount * 10;

    }


    return state;
  }

}