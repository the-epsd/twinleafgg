import { CardType, ChooseCardsPrompt, EnergyCard, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Dig Deep',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for an Energy card, show it to your opponent, and put it into your hand.',
  },
  {
    name: 'Mud Slap',
    cost: [C, C],
    damage: 20,
    text: '',
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Onix';
  public fullName: string = 'Onix UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dig Deep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasEnergy = player.discard.cards.some((c) => c instanceof EnergyCard);

      if (!hasEnergy) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
      });
    }

    return state;
  }
}
