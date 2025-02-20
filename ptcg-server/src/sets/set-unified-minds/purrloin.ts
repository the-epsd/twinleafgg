import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_TOOLS_FROM_OPPONENTS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Purrloin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Cleaning Up',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Discard a Pokémon Tool from 1 of your opponent\'s Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Purrloin';
  public fullName: string = 'Purrloin UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return DISCARD_TOOLS_FROM_OPPONENTS_POKEMON(store, state, player, 0, 2);
    }

    return state;
  }

}