import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { BOOST_IF_OTHER_ANCIENT_ATTACKED_LAST_TURN } from "../../../game/store/prefabs/attack-effects";

export class Koraidon extends PokemonCard {
  protected _tags = [CardTag.ANCIENT];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 130;
  public retreat = [C, C];
  public weakness = [{ type: P }];

  public attacks = [
    {
      name: 'Unrelenting Onslaught',
      cost: [C, C],
      damage: 30,
      damageCalculator: '+',
      text: 'If 1 of your other Ancient Pokémon used an attack during your last turn, this attack does 150 more damage.',
    },
    {
      name: 'Hammer In',
      cost: [F, F, C],
      damage: 110,
      text: '',
    },
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Koraidon';
  public fullName: string = 'Koraidon SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Unrelenting Onslaught
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BOOST_IF_OTHER_ANCIENT_ATTACKED_LAST_TURN(state, effect, this, 150);
    }
    return state;
  }
}
