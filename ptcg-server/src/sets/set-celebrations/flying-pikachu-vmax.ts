import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, 
  StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class FlyingPikachuVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Flying Pikachu V';

  public tags = [ CardTag.POKEMON_VMAX ];
  
  public regulationMark = 'E';
  
  public cardType: CardType = CardType.LIGHTNING;
  
  public hp: number = 310;
  
  public weakness = [{ type: CardType.LIGHTNING}];
  
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  
  public retreat = [ ];

  public attacks = [
    {
      name: 'Max Balloon',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 160,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
    }
  ];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Flying Pikachu VMAX';

  public fullName: string = 'Flying Pikachu VMAX CEL';

  public readonly MAX_BALLOON_MARKER: string = 'MAX_BALLOON_MARKER';

  public readonly CLEAR_MAX_BALLOON_MARKER: string = 'CLEAR_MAX_BALLOON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.MAX_BALLOON_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_MAX_BALLOON_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.MAX_BALLOON_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.BASIC) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.marker.hasMarker(this.CLEAR_MAX_BALLOON_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_MAX_BALLOON_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.MAX_BALLOON_MARKER, this);
        });
      }
    }

    return state;
  }

}
