import { CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class GalarianMrMime extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 80;

  public weakness = [{ type: M }];

  public retreat: CardType[] = [C];

  public attacks = [{
    name: 'Reflect',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  },
  { name: 'Icy Snow', cost: [C, C], damage: 30, text: '' }];
  
  public regulationMark = 'D';

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '35';

  public name: string = 'Galarian Mr. Mime';

  public fullName: string = 'Galarian Mr. Mime DAA';

  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) &&
      effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)
    ) {
      effect.damage -= 30;
      return state;
    }

    if (effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      });
    }
    return state;
  }
}