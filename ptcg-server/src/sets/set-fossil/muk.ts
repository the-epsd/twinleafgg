import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC, value: 2 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Toxic Gas',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Ignore all Pokémon Powers other than Toxic Gases. This power stops working while Muk is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Sludge',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Muk';

  public fullName: string = 'Muk FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      // Implement Toxic Gas logic
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Implement Sludge logic
    }
    return state;
  }
}