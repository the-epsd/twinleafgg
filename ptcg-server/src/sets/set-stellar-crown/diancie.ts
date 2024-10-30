import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, SuperType, EnergyType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Diancie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Diffuse Reflection',
      cost: [C],
      damage: 40,
      damageCalculation: 'x',
      text: 'This attack does 40 damage for each Special Energy attached to all of your opponent\'s Pokémon.',
    }, {
      name: 'Power Gem',
      cost: [F, C],
      damage: 60,
      text: ''
    }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Diancie';
  public fullName: string = 'Diancie SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let specialEnergyCount = 0;

      // Count special energy on all opponent's Pokemon
      opponent.bench.concat([opponent.active]).forEach(pokemon => {
        if (pokemon) {
          pokemon.cards.forEach(card => {
            if (card.superType === SuperType.ENERGY && card.energyType === EnergyType.SPECIAL) {
              specialEnergyCount++;
            }
          });
        }
      });
      effect.damage = 40 * specialEnergyCount;
      console.log(effect.damage);
    }
    return state;
  }
}