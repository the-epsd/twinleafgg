import { Attack, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Spearow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Spearhead',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Spearow';
  public fullName: string = 'Spearow CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }
}
