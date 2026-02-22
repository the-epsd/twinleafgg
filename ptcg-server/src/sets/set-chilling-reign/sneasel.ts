import { PokemonCard, Stage, CardTag, CardType, Card, ChooseCardsPrompt, CoinFlipPrompt, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.RAPID_STRIKE];

  public cardType = CardType.WATER;

  public hp = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Cut Down',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'CRE';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Sneasel';

  public fullName: string = 'Sneasel CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          // Defending Pokemon has no energy cards attached
          // Check if any card in energies array has energyType property (works for both EnergyCard and Pokemon-as-energy)
          if (!opponent.active.energies.cards.some(c => (c as any).energyType !== undefined)) {
            return state;
          }

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active.energies,
            {},
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];
            return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
          });
        }
      });
      return state;
    }
    return state;
  }
}