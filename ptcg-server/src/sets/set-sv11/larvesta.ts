import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game';

export class Larvesta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck Off',
    cost: [C],
    damage: 10,
    text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Larvesta';
  public fullName: string = 'Larvesta SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active;
      if (activePokemon.tool) {
        activePokemon.moveCardTo(activePokemon.tool, opponent.discard);
        activePokemon.tool = undefined;
      }
      return state;
    }
    return state;
  }
}
