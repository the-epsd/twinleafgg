import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Minun extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  
  public attacks = [{
    name: 'Negative Ion',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
  },
  {
    name: 'Electrishower',
    cost: [CardType.LIGHTNING],
    damage: 0,
    text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Minun';
  public fullName: string = 'Minun DEX';


  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      effect.damage = 10;
      
      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
      
      return state;
    }

    if (effect instanceof PutDamageEffect) {
      if (effect.source.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this)) {
        effect.damage -= 30;
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
