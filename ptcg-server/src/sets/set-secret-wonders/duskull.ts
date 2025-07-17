import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, PlayerType } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MOVE_CARD_TO, SHUFFLE_DECK, SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';

export class Duskull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D, value: +10 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Reaper Cloth',
    powerType: PowerType.HELD_ITEM,
    text: 'Duskull can evolve during the turn you play it.'
  }];

  public attacks = [{
    name: 'Astonish',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking. Look at that card you chose, then have your opponent shuffle that card into his or her deck.'
  }];

  public set: string = 'SW';
  public name: string = 'Duskull';
  public fullName: string = 'Duskull SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;

      if (effect.target.getPokemonCard() !== this) {
        return state;
      }

      player.canEvolve = true;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.pokemonPlayedTurn = state.turn - 1;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          if (opponent.hand.cards.length > 0) {
            const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
            const randomCard = opponent.hand.cards[randomIndex];
            SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
            MOVE_CARD_TO(state, randomCard, opponent.deck);
            SHUFFLE_DECK(store, state, opponent);
          }
        }
      });
    }

    return state;
  }

}