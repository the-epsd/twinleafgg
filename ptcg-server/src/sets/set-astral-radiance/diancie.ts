import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Diancie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;  

  public hp: number = 90;

  public powers = [{
    name: 'Princess\'s Curtain',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched Basic Pokémon.'
  }];

  public attacks = [{
    name: 'Spike Draw',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Draw 2 cards.'
  }];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Diancie';

  public fullName: string = 'Diancie ASR';

  PRINCESS_CURTAIN_MARKER = 'PRINCESS_CURTAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PRINCESS_CURTAIN_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      if (player.active.cards[0] !== this) {
        console.log('BASICS UNPROTECTED');
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.stage === Stage.BASIC) {
            cardList.marker.removeMarker(this.PRINCESS_CURTAIN_MARKER, this);
          }

          if (player.active.cards[0] == this) {
            console.log('BASICS PROTECTED');
            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
              if (card.stage === Stage.BASIC) {
                cardList.marker.addMarker(this.PRINCESS_CURTAIN_MARKER, this);
              }

              if (effect instanceof ChoosePokemonPrompt) {
                if (cardList.marker.hasMarker(this.PRINCESS_CURTAIN_MARKER, this)) {
                  return state;
                }
              }
              return state;
            });
            return state;
          }
          return state;
        });
        return state;
      }
      return state;
    }
    return state;
  }
}