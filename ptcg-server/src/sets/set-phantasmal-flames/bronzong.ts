import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Triple Draw',
    cost: [C],
    damage: 0,
    text: 'Draw 3 cards.'
  }, {
    name: 'Tool Drop',
    cost: [C, C, C],
    damage: 0,
    text: 'This attack does 40 damage for each Pokémon Tool attached to all Pokemon in play.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 3);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let toolCount = 0;

      // Count tools on player's Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.tools.forEach(card => {
          if (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL) {
            toolCount++;
          }
        });
      });

      // Count tools on opponent's Pokemon
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.tools.forEach(card => {
          if (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL) {
            toolCount++;
          }
        });
      });

      effect.damage = 40 * toolCount;
    }

    return state;
  }
}
