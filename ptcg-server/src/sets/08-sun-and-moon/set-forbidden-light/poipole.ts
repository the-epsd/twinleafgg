import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DENY_PRIZES_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';

export class Poipole extends PokemonCard {
  protected _tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spit Poison',
      cost: [C],
      damage: 0,
      text: "Your opponent's Active Pokémon is now Poisoned.",
    },
    {
      name: 'Knockout Reviver',
      cost: [P, C],
      damage: 0,
      text: "During your opponent's next turn, if this Pokémon is Knocked Out, your opponent can't take any Prize cards for it.",
    },
  ];

  public set: string = 'FLI';
  public name: string = 'Poipole';
  public fullName: string = 'Poipole FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DENY_PRIZES_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
