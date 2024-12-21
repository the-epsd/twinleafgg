import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Treecko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public evolvesInto = 'Grovyle';

  public attacks = [{
    name: 'Find a Friend',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Search your deck for a G Pokemon, reveal it, and put it into your hand. Then, shuffle the deck.'
  }];

  public setNumber: string = '20';
  public set: string = 'LOT';
  public fullName: string = 'Treecko LOT';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Treecko';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, cardType: CardType.GRASS },
        { min: 0, max: 1, allowCancel: true }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}