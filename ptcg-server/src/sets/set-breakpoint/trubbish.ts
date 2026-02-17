import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage } from '../../game/game-message';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Trubbish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Acid Spray',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'BKP';
  public name: string = 'Trubbish';
  public fullName: string = 'Trubbish BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Acid Spray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check for energy to discard
      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const discardEnergy = new DiscardCardsEffect(effect, selected);
            return store.reduceEffect(state, discardEnergy);
          });
        }
      });
    }

    return state;
  }

}
