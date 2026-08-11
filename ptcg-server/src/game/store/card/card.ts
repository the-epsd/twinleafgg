import { CardTag, CardType, EnergyType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { AfterAttackEffect, BeforeDoingDamageEffect } from '../effects/game-phase-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
import { Attack, Power } from './pokemon-types';
import { Player } from '../state/player';

export abstract class Card {
  public abstract set: string;
  public abstract superType: SuperType;
  public abstract format: Format;
  public abstract fullName: string;
  public abstract name: string;
  public energyType: EnergyType | undefined;
  public id: number = -1;
  public regulationMark: string = '';
  public tags: string[] = [];
  public setNumber: string = '';
  public cardImage: string = '';
  public retreat: CardType[] = [];
  public attacks: Attack[] = [];
  public powers: Power[] = [];
  static tags: any;
  public cards: CardList = new CardList();
  public marker = new Marker();
  public canPlay?(store: StoreLike, state: State, player: Player): boolean | undefined;
  public canUseFromHandToBench?(
    store: StoreLike,
    state: State,
    player: Player,
  ): boolean | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (
      effect instanceof AttackEffect ||
      effect instanceof AfterAttackEffect ||
      effect instanceof BeforeDoingDamageEffect
    ) {
      for (const attack of this.attacks) {
        if (effect.attack === attack && typeof attack.effect === 'function') {
          state = this.invokeAttackEffect(attack.effect, store, state, effect);
        }
      }
    } else if (effect instanceof PowerEffect) {
      for (const power of this.powers) {
        if (effect.power === power && typeof power.effect === 'function') {
          return power.effect(store, state, effect);
        }
      }
    }
    return state;
  }

  private invokeAttackEffect(
    handler: NonNullable<Attack['effect']>,
    store: StoreLike,
    state: State,
    effect: Effect,
  ): State {
    // State-only prefabs (e.g. DISCARD_A_STADIUM_CARD_IN_PLAY(state))
    if (handler.length <= 1) {
      const result = (handler as unknown as (state: State) => State | void)(state);
      return result === undefined ? state : result;
    }
    const result = (
      handler as (store: StoreLike, state: State, effect: Effect) => State | void
    )(store, state, effect);
    return result === undefined ? state : result;
  }

  public hasRuleBox() {
    return (
      (this.tags.includes(CardTag.POKEMON_ex) && this.regulationMark) || // Gen 3-era ex do not have a Rule box. Separate Mega ex check not necessary
      this.tags.includes(CardTag.POKEMON_V) ||
      this.tags.includes(CardTag.POKEMON_VMAX) ||
      this.tags.includes(CardTag.POKEMON_VSTAR) ||
      this.tags.includes(CardTag.POKEMON_VUNION) ||
      this.tags.includes(CardTag.POKEMON_GX) || // All rule box TAG TEAM mons are Pokémon-GX so an extra check is not necessary
      this.tags.includes(CardTag.POKEMON_EX) || // Same with M EX/Primals/etc.
      this.tags.includes(CardTag.BREAK) ||
      this.tags.includes(CardTag.PRISM_STAR) ||
      this.tags.includes(CardTag.RADIANT)
    );
  }
}
