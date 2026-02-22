import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Psyduck';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Energy Loop',
    cost: [W, C],
    damage: 80,
    text: 'Put an Energy attached to this Pokémon into your hand.'
  }];

  public set: string = 'CEC';
  public name: string = 'Golduck';
  public fullName: string = 'Golduck CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;

      let card: Card;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];
        MOVE_CARDS(store, state, player.active, player.hand, { cards: [card], sourceCard: this, sourceEffect: this.attacks[1] });
        return state;
      });
    }
    return state;
  }
}

