import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ShuffleDeckPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Magearna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Overhaul',
    cost: [CardType.METAL],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
  },
  {
    name: 'Windup Cannon',
    cost: [CardType.METAL, CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'VIV';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Magearna';
  public fullName: string = 'Magearna VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.hand.moveTo(player.deck);

      return store.prompt(state, [
        new ShuffleDeckPrompt(player.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder);
        player.deck.moveTo(player.hand, 6);
      });
    }

    if(effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      effect.damage += 20 * opponentBenched;
    }
    return state;
  }
}