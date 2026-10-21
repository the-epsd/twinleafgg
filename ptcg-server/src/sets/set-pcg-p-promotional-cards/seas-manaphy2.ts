import { CardType, ChooseCardsPrompt, EnergyCard, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class SeasManaphy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Pickup Power',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for an Energy card, show it to your opponent, and put it into your hand.',
  },
  {
    name: 'Aqua Blast',
    cost: [W, C],
    damage: 30,
    text: 'Discard 1 [W] Energy card attached to Sea\'s Manaphy in order to use this attack.',
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '146';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP 146';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pickup Power
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

    // Aqua Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, W);
    }

    return state;
  }
}
