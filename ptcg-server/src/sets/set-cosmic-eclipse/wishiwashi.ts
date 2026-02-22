import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PlayerType, CoinFlipPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BeginTurnEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Wishiwashi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 180;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Scatter',
    powerType: PowerType.ABILITY,
    text: 'At the end of your opponent\'s turn, if this Pokémon has any damage counters on it, flip a coin.If tails, shuffle this Pokémon and all cards attached to it into your deck.'
  }];

  public attacks = [{
    name: 'Hydro Splash',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 130,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wishiwashi';
  public fullName: string = 'Wishiwashi CEC';

  public readonly SCATTER_MARKER = 'SCATTER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BeginTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.SCATTER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && StateUtils.getOpponent(state, effect.player).marker.hasMarker(this.SCATTER_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          if (cardList.damage > 0) {
            return store.prompt(state, [
              new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP)
            ], result => {
              if (result === false) {
                const pokemons = cardList.getPokemons();
                const otherCards = cardList.cards.filter(card =>
                  !(card instanceof PokemonCard) &&
                  !pokemons.includes(card as PokemonCard) &&
                  (!cardList.tools || !cardList.tools.includes(card))
                );
                const tools = [...cardList.tools];

                if (tools.length > 0) {
                  for (const tool of tools) {
                    cardList.moveCardTo(tool, opponent.deck);
                  }
                }

                if (otherCards.length > 0) {
                  MOVE_CARDS(store, state, cardList, opponent.deck, { cards: otherCards });
                }

                if (pokemons.length > 0) {
                  MOVE_CARDS(store, state, cardList, opponent.deck, { cards: pokemons });
                }

                return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
                  opponent.deck.applyOrder(order);
                  opponent.marker.removeMarker(this.SCATTER_MARKER, this);
                  return state;
                });
              }
              opponent.marker.removeMarker(this.SCATTER_MARKER, this);
              return state;
            });
          }
        }
      });
      opponent.marker.removeMarker(this.SCATTER_MARKER, this);
      return state;
    }
    return state;
  }
}