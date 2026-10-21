import { CardType, ChooseCardsPrompt, EnergyType, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Durant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 110;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Digging',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  },
  {
    name: 'Bite',
    cost: [G, C],
    damage: 50,
    text: '',
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Durant';
  public fullName: string = 'Durant SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Digging
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

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
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
