import { CardType, ChooseCardsPrompt, EnergyType, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cyndaquil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Charge Energy',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  },
  {
    name: 'Live Coal',
    cost: [C],
    damage: 10,
    text: '',
  }];

  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Cyndaquil';
  public fullName: string = 'Cyndaquil ASR 23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charge Energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        if (cards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }

        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        SHOW_CARDS_TO_PLAYER(store, state, StateUtils.getOpponent(state, player), cards);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
