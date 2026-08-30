import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { StadiumEffect } from '../../../game/store/effects/play-card-effects';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { StateUtils } from '../../../game/store/state-utils';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { PlayerType } from '../../../game/store/actions/play-card-action';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'New Moon',
    powerType: PowerType.ABILITY,
    text: 'If you have Solrock in play, prevent all effects of any Stadium done to your Pokémon in play.'
  }];

  public attacks = [{
    name: 'Moon Press',
    cost: [P, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Lunatone';
  public fullName: string = 'Lunatone OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // New Moon
    if (effect instanceof StadiumEffect) {
      const owner = effect.player;

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      let hasSolrock = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Solrock') {
          hasSolrock = true;
        }
      });

      if (!hasSolrock) {
        return state;
      }

      if (!effect.skipAbilityLockCheck && IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    return state;
  }
}
