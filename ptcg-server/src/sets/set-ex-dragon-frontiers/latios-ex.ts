import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Latiosex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Link Wing',
    powerType: PowerType.POKEBODY,
    text: 'The Retreat Cost for each of your Latias, Latias ex, Latios, and Latios ex is 0.'
  }];

  public attacks = [{
    name: 'Ice Barrier',
    cost: [W, C],
    damage: 30,
    text: 'Prevent all effects of an attack, including damage, done to Latios ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
  },
  {
    name: 'Hydro Splash',
    cost: [W, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DF';
  public setNumber: string = '96';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latios ex';
  public fullName: string = 'Latios ex DF';

  public readonly ICE_BARRIER_MARKER = 'ICE_BARRIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isLatiosexInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isLatiosexInPlay = true;
        }
      });

      if (!isLatiosexInPlay) {
        return state;
      }

      if (!IS_POKEBODY_BLOCKED(store, state, player, this) && (active.name === 'Latios' || active.name === 'Latios ex' || active.name === 'Latias' || active.name === 'Latias ex')) {
        effect.cost = [];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.marker.addMarker(this.ICE_BARRIER_MARKER, this);
      ADD_MARKER(this.ICE_BARRIER_MARKER, effect.opponent, this);
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this && effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
      if (this.marker.hasMarker(this.ICE_BARRIER_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.ICE_BARRIER_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.ICE_BARRIER_MARKER, effect.player, this);
      this.marker.removeMarker(this.ICE_BARRIER_MARKER, this);
    }

    return state;
  }
}