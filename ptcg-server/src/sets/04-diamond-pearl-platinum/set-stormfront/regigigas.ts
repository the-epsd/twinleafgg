import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Regigigas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Regi Form',
    powerType: PowerType.POKEBODY,
    text: 'If you have Regirock, Regice, and Registeel in play, the attack cost of Regigigas\'s attacks is Colorless less.'
  }];

  public attacks = [{
    name: 'Mega Punch',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Giga Power',
    cost: [W, F, M, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may do 60 damage plus 40 more damage. If you do, Regigigas does 40 damage to itself.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Regigigas';
  public fullName: string = 'Regigigas SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Form
    if (effect instanceof CheckAttackCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      let hasRegirock = false;
      let hasRegice = false;
      let hasRegisteel = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.name === 'Regirock') {
          hasRegirock = true;
        } else if (card.name === 'Regice') {
          hasRegice = true;
        } else if (card.name === 'Registeel') {
          hasRegisteel = true;
        }
      });
      if (hasRegirock && hasRegice && hasRegisteel) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    // Giga Power
    if (WAS_ATTACK_USED(effect, 1, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 40;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
        }
      });
    }

    return state;
  }
}
