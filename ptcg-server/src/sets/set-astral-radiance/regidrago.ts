import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Regidrago extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 130;

  public weakness = [];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Dragon\'s Hoard',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, if this Pokémon is in the Active Spot, you may draw cards until you have 4 cards in your hand. You can\'t use more than 1 Dragon\'s Hoard Ability each turn.'
    }
  ];

  public attacks = [
    {
      name: 'Giant Fangs',
      cost: [CardType.GRASS, CardType.FIRE, CardType.COLORLESS],
      damage: 160,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name: string = 'Regidrago';

  public fullName: string = 'Regidrago ASR';

  public readonly DRAGONS_HOARD_MARKER = 'DRAGONS_HOARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DRAGONS_HOARD_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.DRAGONS_HOARD_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.active.cards[0] !== this || player.hand.cards.length >= 4) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.DRAGONS_HOARD_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.DRAGONS_HOARD_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      if (player.active.getPokemonCard() === this) {
        while (player.hand.cards.length < 4) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }
      }
    }

    return state;
  }
}