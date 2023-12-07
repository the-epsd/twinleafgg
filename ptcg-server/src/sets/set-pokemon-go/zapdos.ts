import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Zapdos extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Lightning Symbol',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Your Basic [L] Pokémon\'s attacks, except any Zapdos, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';
  
  public set2: string = 'pokemongo';
  
  public setNumber: string = '29';
  
  public name: string = 'Zapdos';
  
  public fullName: string = 'Zapdos PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      
      if (player.active.getPokemonCard()?.stage == Stage.BASIC && player.active.getPokemonCard()?.cardType == CardType.LIGHTNING) {
        if (effect instanceof DealDamageEffect) {
          if (effect.card.name !== 'Zapdos') {
            // exclude Zapdos
            effect.damage += 10;
          }
          return state;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}