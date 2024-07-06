import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PlayerType, CoinFlipPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Wishiwashi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 180;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

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

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      opponent.marker.addMarker(this.SCATTER_MARKER, this);

      if (effect.player.marker.hasMarker(this.SCATTER_MARKER, this)) {
        owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.getPokemonCard()?.fullName === this.fullName && cardList.damage > 0) {
            return store.prompt(state, [
              new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
            ], result => {
              if (result === false) {
                cardList.moveTo(owner.deck);
              }
            });
          }
        });

        return store.prompt(state, new ShuffleDeckPrompt(owner.id), order => {
          owner.deck.applyOrder(order);
          player.marker.removeMarker(this.SCATTER_MARKER, this);
          return state;
        });
      }
    }

    return state;
  }
}