import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smithereen Smash',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Hyper Beam',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public name: string = 'Trapinch';
  public fullName: string = 'Trapinch BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Smithereen Smash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }
      });
    }

    return state;
  }

}
