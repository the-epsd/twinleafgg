import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PokemonCardList, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hippopotas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Sand Attack',
    cost: [F],
    damage: 10,
    text: 'During your opponent\'s next turn, if the Defending Pokemon tries to use an attack, your opponent flips a coin. If tails, that attack doesn\'t happen.'
  },
  {
    name: 'Bite',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Hippopotas';
  public fullName: string = 'Hippopotas M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Attack - mark opponent's Active Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      opponent.marker.addMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
    }

    // Prevent attack with coin flip during opponent's turn
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      const player = effect.player;

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result === false) {
          // Tails - attack doesn't happen
          effect.preventDefault = true;
        }
      });

      return store.reduceEffect(state, coinFlipEffect);
    }

    // Clear marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      effect.player.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }

    return state;
  }
}
