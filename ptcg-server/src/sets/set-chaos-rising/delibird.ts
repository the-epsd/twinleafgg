import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, AttachEnergyPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Delibird extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Happy Present',
    cost: [C],
    damage: 0,
    text: 'Both players may attach up to 3 Energy from their hand to their Pokemon in any way they like. (Your opponent attaches first.)'
  },
  {
    name: 'Flap',
    cost: [C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Delibird';
  public fullName: string = 'Delibird M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new AttachEnergyPrompt(
        opponent.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        opponent.hand,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 0, max: 3 }
      ), () => {
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: true, min: 0, max: 3 }
        ), () => state);
      });
    }
    return state;
  }
}
