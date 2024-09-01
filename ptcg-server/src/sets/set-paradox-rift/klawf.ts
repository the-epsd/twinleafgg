import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Klawf extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Unhinged Scissors',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      damageCalculation: '+',
      text: 'If this Pokémon is affected by a Special Condition, this attack does 160 more damage.'
    },
    {
      name: 'Boiled Press',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 80,
      text: 'This Pokémon is now Burned.'
    }
  ];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name: string = 'Klawf';

  public fullName: string = 'Klawf PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const specialConditions = player.active.specialConditions;
      if (specialConditions.length > 0) {
        effect.damage += 160;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      player.active.addSpecialCondition(SpecialCondition.BURNED);
    }

    return state;
  }
}