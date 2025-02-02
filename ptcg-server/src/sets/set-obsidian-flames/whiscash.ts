import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Whiscash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIGHTING;
  public evolvesFrom = 'Barboach';
  public hp: number = 140;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Raging and Rocking',
    cost: [CardType.FIGHTING],
    damage: 0,
    text: 'For each [F] Energy attached to this Pokémon, discard the top card of your opponent\'s deck.'
  },
  {
    name: 'Land Crush',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 140,
    text: ''
  }];

  public set: string = 'OBF';
  public setNumber: string = '109';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Whiscash';
  public fullName: string = 'Whiscash OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Count total FIGHTING energy provided
      const totalFightingnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.FIGHTING || type === CardType.ANY).length;
      }, 0);

      opponent.deck.moveTo(opponent.discard, totalFightingnergy);

    }

    return state;
  }

}