import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { DRAW_CARDS, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Herdier extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lillipup';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Collect', cost: [C, C], damage: 0, text: 'Draw 3 cards.' },
    { name: 'Bite', cost: [C, C, C], damage: 50, text: '' },
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Herdier';
  public fullName: string = 'Herdier BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 3);
    }
    return state;
  }
}