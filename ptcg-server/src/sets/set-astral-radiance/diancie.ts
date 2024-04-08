import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';

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
        player.marker.removeMarker(this.PRINCESS_CURTAIN_MARKER, this);
      }

      if (player.active.cards[0] == this) {
        console.log('BASICS PROTECTED');
        player.marker.addMarker(this.PRINCESS_CURTAIN_MARKER, this);
      }

      if (effect instanceof TrainerEffect && effect.trainerCard.trainerType == TrainerType.SUPPORTER && effect.target?.cards.some((card) => card instanceof PokemonCard && card.stage === Stage.BASIC)) {
        if (player.marker.hasMarker(this.PRINCESS_CURTAIN_MARKER, this)) {
          effect.preventDefault = true;
          return state;
        }
      }
      return state;
    }
    return state;
  }
}
