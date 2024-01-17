import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, PowerType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class MimikyuV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 160;

  public weakness = [{
    type: CardType.DARK
  }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Dummmy Doll',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your ' +
        'Bench during your turn, you may prevent all damage ' +
        'done to this Mimikyu V by attacks from your opponent\'s ' +
        'Pokémon until the end of your opponent’s next turn.'
  }];

  public attacks = [
    {
      name: 'X-Scissor',
      cost: [ CardType.PSYCHIC ],
      damage: 30,
      text: 'Put 3 damage counters on your opponent’s Active Pokémon ' +
        'for each Prize card your opponent has taken. '
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public regulationMark = 'E';

  public name: string = 'Mimikyu V';

  public fullName: string = 'Mimikyu V BST';

  public readonly TIME_CIRCLE_MARKER: string = 'TIME_CIRCLE_MARKER';
  public readonly CLEAR_TIME_CIRCLE_MARKER: string = 'CLEAR_TIME_CIRCLE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
      return state;
    }
  
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {

      const sourcePokemon = effect.source.getPokemonCard();
    
      if (sourcePokemon !== this) {
        effect.preventDefault = true; 
      }
    
      return state;
    
    }

    if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const player = StateUtils.getOpponent(state, effect.player);
      player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
          cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
        }
      });
      return state;
    }
  
    return state;
  }
}