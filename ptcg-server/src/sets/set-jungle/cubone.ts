import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cubone extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 40;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [{ type: CardType.LIGHTNING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Snivel',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'If the Defending Pokémon attacks Cubone during your opponent\'s next turn, any damage done by the attack is reduced by 20 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
  },
  {
    name: 'Rage',
    cost: [CardType.FIGHTING, CardType.FIGHTING],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each damage counter on Cubone.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Cubone';

  public fullName: string = 'Cubone JU';

  public REDUCE_DAMAGE_MARKER = 'REDUCE_DAMAGE_MARKER';

  public CLEAR_REDUCE_DAMAGE_MARKER = 'CLEAR_REDUCE_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.REDUCE_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage = effect.player.active.damage * 10;
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.REDUCE_DAMAGE_MARKER)) {
      effect.damage -= 20;
      return state;
    }
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.REDUCE_DAMAGE_MARKER, this);
      });
    }

    return state;
  }

}