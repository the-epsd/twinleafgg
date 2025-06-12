import { Attack, CardType, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magby extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 30;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [];

  public attacks: Attack[] = [{
    name: 'Scorching Heater',
    cost: [],
    damage: 0,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack ' +
      '(even if it is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
  }];

  public set: string = 'PAR';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Magby';
  public fullName: string = 'Magby PAR';

  public readonly SCORCHING_HEATER_MARKER = 'SCORCHING_HEATER_MARKER';
  public readonly CLEAR_SCORCHING_HEATER_MARKER = 'CLEAR_SCORCHING_HEATER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      ADD_MARKER(this.SCORCHING_HEATER_MARKER, cardList, this);
      ADD_MARKER(this.CLEAR_SCORCHING_HEATER_MARKER, opponent, this);
    }

    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) && HAS_MARKER(this.SCORCHING_HEATER_MARKER, effect.target, this)) {
      effect.source.damage += 30;
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SCORCHING_HEATER_MARKER, this.SCORCHING_HEATER_MARKER, this);

    return state;
  }
}