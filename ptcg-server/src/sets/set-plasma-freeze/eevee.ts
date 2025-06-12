import { Attack, CardType, GamePhase, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Eevee extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Growl',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon ' +
        'is reduced by 20 (before applying Weakness and Resistance).',
    },
    {
      name: 'Quick Attack',
      cost: [C, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.',
    },
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee PLF';

  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof PutDamageEffect && state.phase === GamePhase.ATTACK) {
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

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}