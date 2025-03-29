import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ShowCardsPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Woobat extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scout',
      cost: [P],
      damage: 0,
      text: 'Your opponent reveals their hand.'
    },

    {
      name: 'Heart Stamp',
      cost: [C, C],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'BCR';
  public setNumber = '70';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Woobat';
  public fullName: string = 'Woobat BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // See Through
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        opponent.hand.cards,
      ), () => { });
    }

    return state;
  }
}