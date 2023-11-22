import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PokemonCard, StateUtils } from '../../game';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class HisuianGoodraVSTAR extends PokemonCard {
  
  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Hisuian Goodra V';

  public cardTag = [ CardTag.POKEMON_VSTAR ];

  public regulationMark = 'F';
  
  public cardType: CardType = CardType.DRAGON;
  
  public hp: number = 270;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Rolling Iron',
      cost: [ CardType.WATER, CardType.METAL, CardType.COLORLESS ],
      damage: 200,
      text: 'During your opponent\'s next turn, this Pokémon takes 80 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];
  
  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '136';
  
  public name: string = 'Hisuian Goodra VSTAR';
  
  public fullName: string = 'Hisuian Goodra VSTAR LOR';

  ROLLING_IRON_MARKER = 'ROLLING_IRON_MARKER';

  CLEAR_ROLLING_IRON_MARKER = 'CLEAR_ROLLING_IRON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      // Get reference to player and target Pokemon
      if (effect instanceof HealEffect && effect.card === this) {

        const healEffect = new HealEffect(effect.player, effect.target, effect.damage);
        store.reduceEffect(state, healEffect);
      }

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);

        player.active.marker.addMarker(this.ROLLING_IRON_MARKER, this);
        opponent.marker.addMarker(this.CLEAR_ROLLING_IRON_MARKER, this);

        if (effect instanceof PutDamageEffect
                    && effect.target.marker.hasMarker(this.ROLLING_IRON_MARKER)) {
          effect.damage -= 80;
          return state;
        }
        if (effect instanceof EndTurnEffect
                    && effect.player.marker.hasMarker(this.CLEAR_ROLLING_IRON_MARKER, this)) {
          effect.player.marker.removeMarker(this.CLEAR_ROLLING_IRON_MARKER, this);
          const opponent = StateUtils.getOpponent(state, effect.player);
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            cardList.marker.removeMarker(this.ROLLING_IRON_MARKER, this);
          });
        }
        return state;
      }
      return state;
    }
    return state;
  }

}