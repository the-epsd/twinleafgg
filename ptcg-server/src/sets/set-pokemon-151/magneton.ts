import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Junk Magnet',
    cost: [L],
    damage: 0,
    text: 'Put up to 2 Item cards from your discard pile into your hand.'
  },
  {
    name: 'Head Bolt',
    cost: [L, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'MEW';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 2, allowCancel: false }
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