import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class RayquazaV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.RAPID_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 210;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Azure Pulse',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard your hand and draw 3 cards.'
  }];

  public attacks = [
    {
      name: 'Max Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING ],
      damage: 20,
      text: 'You may discard any amount of basic [R] Energy or any amount of basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name: string = 'Rayquaza V';

  public fullName: string = 'Rayquaza V EVS';

  public readonly REGAL_STANCE_MARKER = 'REGAL_STANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
        
      const player = effect.player;

      if (player.marker.hasMarker(this.REGAL_STANCE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 3);
      player.marker.addMarker(this.REGAL_STANCE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
    }
    return state;
  }
}