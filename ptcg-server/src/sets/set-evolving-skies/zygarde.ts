import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zygarde extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = N;
  public hp: number = 130;
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Judgement Surge',
    cost: [G, F, C],
    damage: 0,
    text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon for each Prize card your opponent has taken. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'EVS';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '118';
  public name: string = 'Zygarde';
  public fullName: string = 'Zygarde EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(40 * effect.opponent.prizesTaken, effect, store, state);
    }

    return state;
  }
}