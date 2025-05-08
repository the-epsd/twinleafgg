import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Reshiramex extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 230;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Blaze Burst',
    cost: [R, R, C],
    damage: 130,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Prize card your opponent has taken. Discard an Energy from this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reshiram ex';
  public fullName: string = 'Reshiram ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const prizesTaken = 6 - opponent.getPrizeLeft();
      const additionalDamage = 50 * prizesTaken;

      // Apply additional damage based on prizes taken
      effect.damage += additionalDamage;

      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }
    return state;
  }
}
