import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Moltres extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 120;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Flare Symbol',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Your Basic [R] Pokémon\'s attacks, except any Moltres, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Fire Wing',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';
  
  public set2: string = 'pokemongo';
  
  public setNumber: string = '12';
  
  public name: string = 'Moltres';
  
  public fullName: string = 'Moltres PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const legendaryBird = player.active.getPokemonCard();
      
      if (legendaryBird && legendaryBird.stage == Stage.BASIC && legendaryBird.cardType == CardType.FIRE) {
        if (effect instanceof DealDamageEffect) {
          if (effect.card.name !== 'Moltres') {
            // exclude Moltres
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