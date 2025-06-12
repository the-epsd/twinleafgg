import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PokemonCard, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Onix extends PokemonCard {

  public cardType = F;
  public hp = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Dig Deep',
      cost: [C],
      damage: 0,
      text: 'Put an Energy card from your discard pile into your hand.'
    },
    {
      name: 'Tail Smash',
      cost: [C, C, C],
      damage: 100,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set = 'CEC';
  public setNumber = '105';
  public cardImage = 'assets/cardback.png';
  public name = 'Onix';
  public fullName = 'Onix CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      //I couldn't find a prefab that moves energies from the discard to the hand.
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

    if (WAS_ATTACK_USED(effect, 1, this)) {
      //Flip a coin. If tails, this attack does nothing.
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result)
          return;
        effect.damage = 0;
      });
    }

    return state;
  }
}