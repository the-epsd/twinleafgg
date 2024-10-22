import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';

export class Haunter extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public evolvesTo = ['Gengar', 'Gengar ex'];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [];

  public resistance = [{ type: CardType.FIGHTING, value: 30 }];

  public retreat = [];

  public powers = [{
    name: 'Transparency',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Nightmare',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      //Implement ability logic
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      //Implement attack logic
    }

    return state;
  }

}
