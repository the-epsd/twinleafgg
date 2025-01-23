import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import {AddSpecialConditionsEffect} from '../../game/store/effects/attack-effects';

export class Incineroarex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Torracat';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 320;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Hustle Play',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Attacks used by this Pokémon cost [C] less for each of your opponent\'s Benched Pokémon.'
  }];

  public attacks = [
    { 
      name: 'Blaze Blast', 
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], 
      damage: 240, 
      text: 'Your opponent\'s Active Pokémon is now Burned.' 
    }
  ];

  public set: string = 'TEF';

  public setNumber = '34';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Incineroar ex';

  public fullName: string = 'Incineroar ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hustle Play
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this){
        return state;
      }

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const index = effect.cost.indexOf(CardType.COLORLESS);
      effect.cost.splice(index, benched);
        
      return state;
    }

    // Blaze Blast
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
