import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {HealTargetEffect} from '../../game/store/effects/attack-effects';
import {CheckPokemonStatsEffect} from '../../game/store/effects/check-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class GardevoirEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Life Leap',
      cost: [ Y ],
      damage: 20,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    }, {
      name: 'Shining Wind',
      cost: [ Y, Y, Y ],
      damage: 100,
      text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
    },
  ];

  public set: string = 'PRC';
  public name: string = 'Gardevoir EX';
  public fullName: string = 'Gardevoir EX PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';

  public readonly SHINING_WIND_MARKER = 'SHINING_WIND_MARKER';
  public readonly CLEAR_SHINING_WIND_MARKER = 'CLEAR_SHINING_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life Leap
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      
      const healTargetEffect = new HealTargetEffect(effect, effect.damage);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    // Shining Wind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      player.active.marker.addMarker(this.SHINING_WIND_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SHINING_WIND_MARKER, this);
    }

    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);
      if (player.active.marker.hasMarker(this.SHINING_WIND_MARKER, this)) {
        effect.weakness = [];
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SHINING_WIND_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SHINING_WIND_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SHINING_WIND_MARKER, this);
      });
    }

    return state;
  }

}
