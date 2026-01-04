import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardEnergyPrompt } from '../../../game/store/prompts/discard-energy-prompt';
import { COIN_FLIP_PROMPT, AFTER_ATTACK } from '../../../game/store/prefabs/prefabs';
import { GameMessage, SlotType, PlayerType, StateUtils } from '../../../game';

export class Croconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Totodile';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Crunch',
    cost: [W, W],
    damage: 50,
    text: 'Flip a coin. If heads, discard 1 Energy from your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'MC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '167';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          return store.prompt(state, new DiscardEnergyPrompt(
            effect.player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE],
            {},
            { allowCancel: false, min: 1, max: 1 }
          ), transfers => {
            transfers = transfers || [];
            if (transfers.length > 0) {
              const target = StateUtils.getTarget(state, effect.opponent, transfers[0].from);
              target.moveCardTo(transfers[0].card, effect.opponent.discard);
            }
          });
        }
      });
    }
    return state;
  }
}