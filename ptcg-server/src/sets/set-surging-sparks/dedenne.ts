import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dedenne extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Electromagnetic Sonar',
    cost: [C],
    damage: 0,
    text: 'Put a Trainer card from your discard pile into your hand.'
  },
  {
    name: 'Gnaw',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Dedenne';
  public fullName: string = 'Dedenne SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        if (selected) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
          MOVE_CARDS(store, state, player.discard, player.hand, { cards: selected });
        }
      });
    }

    return state;
  }
}