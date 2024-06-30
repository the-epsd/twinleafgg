import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Dodrio extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Doduo';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ ];

  public powers = [{
    name: 'Retreat Aid',
    powerType: PowerType.POKEPOWER,
    text: 'As long as Dodrio is Benched, pay C less to retreat your Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Rage',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 10,
      text: 'Does 10 damage plus 10 more damage for each damage counter on Dodrio.',
    }
  ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '34';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
    
      let isDodrioInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isDodrioInPlay = true;
        }
      });
    
      if (!isDodrioInPlay) {
        return state;
      }
    
      // Try to reduce PowerEffect, to check if something is blocking our ability
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
    
      const pokemonCard = player.active.getPokemonCard();
      
      if (pokemonCard) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
    
        }

        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
          effect.damage += effect.player.active.damage;
          return state;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}