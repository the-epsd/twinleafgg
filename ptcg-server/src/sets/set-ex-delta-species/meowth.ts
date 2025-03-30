import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PokemonCard, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {

  public cardType = C;
  public hp = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pickup Power',
      cost: [C],
      damage: 0,
      text: 'Put an Energy card from your discard pile into your hand.'
    },
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set = 'DS';
  public setNumber = '77';
  public cardImage = 'assets/cardback.png';
  public name = 'Meowth';
  public fullName = 'Meowth DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard;
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        cards = cards || [];
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  }
}