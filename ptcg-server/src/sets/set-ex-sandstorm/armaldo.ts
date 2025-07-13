
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Armaldo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Anorith';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Primal Veil',
    powerType: PowerType.POKEBODY,
    text: 'As long as Armaldo is your Active Pokémon, each player can\'t play any Supporter Cards.'
  }];

  public attacks = [{
    name: 'Blade Arms',
    cost: [F, F, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'SS';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Armaldo';
  public fullName: string = 'Armaldo SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const armaldoOwner = player.active.getPokemonCard() === this ? player : opponent;
      if (!IS_POKEBODY_BLOCKED(store, state, armaldoOwner, this)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    return state;
  }

}