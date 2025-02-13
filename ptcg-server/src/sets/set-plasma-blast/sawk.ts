import { Attack, CardTag, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Sawk extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Kick of Righteousness',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'If the Defending Pokémon is a Team Plasma Pokémon, this attack does 40 more damage.'
    },
    { name: 'Low Sweep', cost: [F, C, C], damage: 60, text: '' },
  ];

  public set: string = 'PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Sawk';
  public fullName: string = 'Sawk PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 40, CardTag.TEAM_PLASMA);
    }

    return state;
  }
}