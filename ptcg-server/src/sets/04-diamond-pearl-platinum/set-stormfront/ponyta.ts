import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smash Kick',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Agility',
    cost: [R, C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Ponyta during your opponent\'s next turn.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
