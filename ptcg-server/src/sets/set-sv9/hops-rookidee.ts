import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { AttackEffect, Effect } from '../../game/store/effects/game-effects';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class HopsRookidee extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 60;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Frightening Gaze',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 20 less damage (before applying Weakness and Resistance).'
    },
    { name: 'Peck', cost: [C, C], damage: 20, text: '' },
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public name: string = 'Hop\'s Rookidee';

  public fullName: string = 'Hop\'s Rookidee SV9';

  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof PutDamageEffect) {
      if (effect.source.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this)) {
        effect.damage -= 20;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
      });
    }
    return state;
  }
}