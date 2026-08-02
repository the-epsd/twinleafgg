import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../../game/game-message';
import { StateUtils } from '../../../game/store/state-utils';
import { WAS_ATTACK_USED, FLIP_COIN_FOR_FLY, AFTER_ATTACK, ADD_PARALYZED_TO_PLAYER_ACTIVE } from '../../../game/store/prefabs/prefabs';

export class FlyingPikachuV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 190;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Thunder Shock',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  },
  {
    name: 'Fly',
    cost: [C, C, C],
    damage: 120,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Flying Pikachu V';
  public fullName: string = 'Flying Pikachu V CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Shock
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (flipResult) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, player), this);
        }
      });
    }
    // Fly
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_FOR_FLY(store, state, effect, this);
    }

    return state;
  }
}