import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../..';
import { Effect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Cosmog extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Dust Gathering',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Cosmog';
  public fullName: string = 'Cosmog SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 1);
      return state;
    }

    return state;
  }
}